import { randomUUID } from 'node:crypto';

export const BACK_URL = process.env.E2E_BACK_URL || 'http://localhost:8080';
export const PASSWORD = 'Test1234!';

const STORAGE_AUTH_JWT_KEY = '__smartopenspace_jwt__';
const STORAGE_AUTH_USER_KEY = '__smartopenspace_user__';

export const uniqueEmail = (prefix) => `${prefix}-${randomUUID().slice(0, 8)}@e2e.test`;

export const isoDateFromToday = (days = 1) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const decodeJwtPayload = (token) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));

/**
 * Cliente liviano del back para armar el estado inicial de cada test sin pasar
 * por la UI (la UI se ejercita en los specs, no en el setup).
 */
export class BackApi {
  constructor(request) {
    this.request = request;
    this.sessionId = randomUUID();
  }

  async call(method, path, { token, data } = {}) {
    const response = await this.request.fetch(`${BACK_URL}/${path}`, {
      method,
      data,
      headers: {
        'content-type': 'application/json',
        'X-Internal-Session-Id': this.sessionId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok()) {
      throw new Error(`${method} /${path} -> ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }

  async registerUser(name) {
    const email = uniqueEmail(name.toLowerCase().replace(/\W+/g, '-'));
    const { token } = await this.call('POST', 'v1/auth/register', {
      data: { name, email, password: PASSWORD },
    });
    const payload = decodeJwtPayload(token);
    return { id: payload.user_id, name, email, password: PASSWORD, token };
  }

  createOpenSpace(
    organizer,
    {
      name = 'Open Space E2E',
      description = 'Open space de prueba',
      tracks = [{ name: 'Técnica', description: '', color: '#3F8880' }],
      rooms = ['Sala 1', 'Sala 2'],
      slots = [['10:00:00', '11:00:00'], ['11:00:00', '12:00:00']],
      date = isoDateFromToday(1),
    } = {}
  ) {
    return this.call('POST', `openSpace/${organizer.id}`, {
      token: organizer.token,
      data: {
        name,
        description,
        dates: [date],
        tracks,
        rooms: rooms.map((roomName) => ({ name: roomName, description: '' })),
        slots: slots.map(([startTime, endTime]) => ({ type: 'TalkSlot', startTime, endTime, date })),
      },
    });
  }

  toggleCallForPapers(organizer, openSpaceId) {
    return this.call('PUT', `openSpace/${openSpaceId}/user/${organizer.id}/callForPapers`, {
      token: organizer.token,
    });
  }

  createTalk(speaker, openSpaceId, { name, description = `Descripción de ${name}`, trackId = null } = {}) {
    return this.call('POST', `openSpace/talk/${speaker.id}/${openSpaceId}`, {
      token: speaker.token,
      data: { name, description, meetingLink: '', documents: [], trackId, speakerName: '' },
    });
  }

  activateQueue(organizer, openSpaceId) {
    return this.call('PUT', `openSpace/activateQueue/${organizer.id}/${openSpaceId}`, {
      token: organizer.token,
    });
  }

  enqueueTalk(speaker, talkId) {
    return this.call('PUT', `openSpace/enqueueTalk/${speaker.id}/${talkId}`, { token: speaker.token });
  }
}

/** Deja al navegador con la sesión iniciada, como si hubiera hecho login. */
export const loginAs = (page, user) =>
  page.addInitScript(
    ([jwtKey, userKey, token, storedUser]) => {
      window.localStorage.setItem(jwtKey, JSON.stringify(token));
      window.localStorage.setItem(userKey, JSON.stringify(storedUser));
    },
    [
      STORAGE_AUTH_JWT_KEY,
      STORAGE_AUTH_USER_KEY,
      user.token,
      { id: user.id, email: user.email, name: user.name, token: user.token },
    ]
  );
