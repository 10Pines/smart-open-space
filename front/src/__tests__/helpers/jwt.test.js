import { describe } from 'vitest';
import { decodeJWT, getUserPayloadFromJwt } from '#helpers/jwt.js';

describe('GIVEN decodeJWT func', () => {

    test('WHEN apply with valid jwt THEN return decoded jwt payload', () => {
        
        const jwtValidCases = [
            { 
                jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjotMTAsInVzZXJfZW1haWwiOiIiLCJ1c2VyX25hbWUiOiIiLCJpYXQiOjE3MzQ5MTI1MzksImV4cCI6MTczNDkxMjgzOX0.83JE_NBcgHka4tk_ROkHMq_t2WP0vw_pyZ6zwswd_ps', 
                expected: {
                    exp: 1734912839,
                    iat: 1734912539,
                    user_email: "",
                    user_id: -10,
                    user_name: "",
                },
            },
            { 
                jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', 
                expected: {
                    iat: 1516239022,
                    name: "John Doe",
                    sub: "1234567890",
                },
            },
            { 
                jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTEiLCJ1c2VyX2VtYWlsIjoiYXNkMTIzQGFzZC5jb20iLCJ1c2VyX25hbWUiOiJhc2QxMjMiLCJzdWIiOiJhc2QxMjNAYXNkLmNvbSIsImlhdCI6MTczNDI3Mjk0MCwiZXhwIjoxNzM1NTY4OTQwfQ._9zkQ4VhvkcgriALjX0uJJsIcVT4GfELwxLB-nvTrAs',
                expected: {
                    exp: 1735568940,
                    iat: 1734272940,
                    sub: "asd123@asd.com",
                    user_email: "asd123@asd.com",
                    user_id: "11",
                    user_name: "asd123",
                },
            },
        ];
        jwtValidCases.forEach(({ jwt, expected }) => {
            expect(decodeJWT(jwt)).toStrictEqual(expected);
        });
    });

    test('WHEN apply with invalid jwt THEN return default value', () => {
        
        const invalidJwtCases = [
            { jwt: '', def: null, expected: null },
            { jwt: null, def: '', expected: '' },
            { jwt: ' ', def: 'random', expected: 'random' },
            { jwt: 'saf12asffas', def: undefined, expected: null },
        ];
        invalidJwtCases.forEach(({ jwt, def, expected }) => {
            expect(decodeJWT(jwt, def)).toBe(expected);
        });
    });
});


describe('GIVEN getUserPayloadFromJwt func', () => {

    test('WHEN apply with valid jwt THEN return user payload', () => {
        
        const jwtValidCases = [
            { 
                jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjotMTAsInVzZXJfZW1haWwiOiIiLCJ1c2VyX25hbWUiOiIiLCJpYXQiOjE3MzQ5MTI1MzksImV4cCI6MTczNDkxMjgzOX0.83JE_NBcgHka4tk_ROkHMq_t2WP0vw_pyZ6zwswd_ps', 
                expected: {
                    email: "",
                    id: -10,
                    name: "",
                    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjotMTAsInVzZXJfZW1haWwiOiIiLCJ1c2VyX25hbWUiOiIiLCJpYXQiOjE3MzQ5MTI1MzksImV4cCI6MTczNDkxMjgzOX0.83JE_NBcgHka4tk_ROkHMq_t2WP0vw_pyZ6zwswd_ps',
                },
            },
            { 
                jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTEiLCJ1c2VyX2VtYWlsIjoiYXNkMTIzQGFzZC5jb20iLCJ1c2VyX25hbWUiOiJhc2QxMjMiLCJzdWIiOiJhc2QxMjNAYXNkLmNvbSIsImlhdCI6MTczNDI3Mjk0MCwiZXhwIjoxNzM1NTY4OTQwfQ._9zkQ4VhvkcgriALjX0uJJsIcVT4GfELwxLB-nvTrAs',
                expected: {
                    email: "asd123@asd.com",
                    id: "11",
                    name: "asd123",
                    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTEiLCJ1c2VyX2VtYWlsIjoiYXNkMTIzQGFzZC5jb20iLCJ1c2VyX25hbWUiOiJhc2QxMjMiLCJzdWIiOiJhc2QxMjNAYXNkLmNvbSIsImlhdCI6MTczNDI3Mjk0MCwiZXhwIjoxNzM1NTY4OTQwfQ._9zkQ4VhvkcgriALjX0uJJsIcVT4GfELwxLB-nvTrAs',
                },
            },
        ];
        jwtValidCases.forEach(({ jwt, expected }) => {
            expect(getUserPayloadFromJwt(jwt)).toStrictEqual(expected);
        });
    });

    
    test('WHEN apply with invalid jwt THEN return ....', () => {
        
        const invalidJwtCases = [
            { jwt: '' },
            { jwt: null },
            { jwt: undefined },
            { jwt: ' ' },
            { jwt: 'saf12asffas'},
        ];
        invalidJwtCases.forEach(({ jwt }) => {
            expect(() => getUserPayloadFromJwt(jwt)).toThrowError('Invalid jwt');
        });
    });

});
