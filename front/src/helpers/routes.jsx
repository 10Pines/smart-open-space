import React from 'react';
import { useHistory, useLocation, useParams, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const useID = (id) => ((idParam) => id || idParam)(useParams().id);

const toRoot = '/';
const toLogin = '/login';
const toRegister = '/register';
const toRecoveryEmail = '/recovery-email';
const toResetPassword = (email, token) => `/reset-password?email=${email}&token=${token}`;
const toNewOS = '/new';
const useToOS = (id) => `/os/${useID(id)}`;
const useToEditOS = (id) => `/os/${useID(id)}/edit`;
const useToMyTalks = (id) => `/os/${useID(id)}/myTalks`;
const useToNewTalk = (id) => `/newTalk/${useID(id)}`;
const speakerNameQueryParam = (speakerName = null) =>
  speakerName ? `?speakerName=${speakerName}` : '';
const useToTalk = (id, talkId, speakerName = null) =>
  `/os/${useID(id)}/talk/${useID(talkId)}${speakerNameQueryParam(speakerName)}`;
const useToProjector = (id) => `/os/${useID(id)}/projector`;
const useToSchedule = (id) => `/os/${useID(id)}/schedule`;
const useToEditTalk = (talkId, openSpaceId) =>
  `/os/${useID(openSpaceId)}/editTalk/${talkId}`;

export const RedirectToRoot = () => <Redirect to={toRoot} />;
export const RedirectToLogin = () => <Redirect to={toLogin} />;
export const RedirectToResetPassword = ({ email, token }) => (
  <Redirect to={toResetPassword(email, token)} />
);
export const RedirectToLoginFromOpenSpace = ({ openSpaceId }) => (
  <Redirect to={{ pathname: toLogin, state: { openSpaceId } }} />
);
export const RedirectToOS = ({ id }) => <Redirect to={useToOS(id)} />;
RedirectToOS.propTypes = { id: PropTypes.string.isRequired };

const pushTo = (history, path) => () => history.push(path);
export const usePushToRoot = () => pushTo(useHistory(), toRoot);
export const usePushToLogin = () => pushTo(useHistory(), toLogin);
export const usePushToRegister = () => pushTo(useHistory(), toRegister);
export const usePushToRecoveryEmail = () => pushTo(useHistory(), toRecoveryEmail);
export const usePushToLoginFromOpenSpace = (openSpaceId) =>
  pushTo(useHistory(), { pathname: toLogin, state: { openSpaceId } });
export const usePushToRegisterFromOpenSpace = (openSpaceId) =>
  pushTo(useHistory(), { pathname: toRegister, state: { openSpaceId } });
export const usePushToMyTalks = (id) => pushTo(useHistory(), useToMyTalks(id));
export const usePushToNewOS = () => pushTo(useHistory(), toNewOS);
export const usePushToOpenSpace = (id) => pushTo(useHistory(), useToOS(id));
export const usePushToTalk = (id, talkId, speakerName = null) =>
  pushTo(useHistory(), useToTalk(id, talkId, speakerName));
export const usePushToNewTalk = (id) => pushTo(useHistory(), useToNewTalk(id));
export const usePushToProjector = (id) => pushTo(useHistory(), useToProjector(id));
export const usePushToSchedule = (id) => pushTo(useHistory(), useToSchedule(id));
export const usePushToEditTalk = (talkId, openSpaceId) =>
  pushTo(useHistory(), useToEditTalk(talkId, openSpaceId));
export const usePushToEditOS = (openSpaceId) =>
  pushTo(useHistory(), useToEditOS(openSpaceId));

export const useInRegister = () => useLocation().pathname === toRegister;
