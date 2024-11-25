import { describe, test, expect, afterEach } from 'vitest';
import {
    getSessionStorage,
    getLocalStorage,
    setLocalStorage,
    setSessionStorage,
} from '#helpers/browserStorage';

describe('GIVEN getSessionStorage func', () => {
    
    afterEach(() => {
        sessionStorage.clear();
    });

    test('WHEN apply with some key which exist THEN return value of that key', () => {
        sessionStorage.setItem('key1', '"valueX"');
        sessionStorage.setItem('key2', '{"a": "value"}');

        expect(getSessionStorage('key1')).toBe('valueX');
        expect(getSessionStorage('key2')).toStrictEqual({a: "value"});
    });

    test('WHEN apply with some key which not exist THEN return undefined', () => {
        const result = getSessionStorage('key1');
        expect(result).toBeUndefined();
    });

    test('WHEN apply with some key which not exist and defaultValue THEN return defaultValue', () => {
        const result = getSessionStorage('key1', 'defaultValue');
        expect(result).toBe('defaultValue');
    });
});

describe('GIVEN setSessionStorage func', () => {

    afterEach(() => {
        sessionStorage.clear();
    });

    test('WHEN apply with some key and value THEN return true and can get the value with that key', () => {
        const result = setSessionStorage('key1', 'value');

        expect(result).toBeTruthy();
        expect(getSessionStorage('key1')).toBe('value');
    });

    test('WHEN apply with some error THEN return false and not set that value', () => {
        const omegaObj = {};
        omegaObj.prop = omegaObj;
        const result = setSessionStorage('key1', omegaObj);
        expect(result).toBeFalsy();
        expect(getSessionStorage('key1')).toBeUndefined();
    });
});

describe('GIVEN getLocalStorage func', () => {
    
    afterEach(() => {
        localStorage.clear();
    });

    test('WHEN apply with some key which exist THEN return value of that key', () => {
        localStorage.setItem('key1', '"valueX"');
        localStorage.setItem('key2', '{"a": "value"}');

        expect(getLocalStorage('key1')).toBe('valueX');
        expect(getLocalStorage('key2')).toStrictEqual({a: "value"});
    });

    test('WHEN apply with some key which not exist and not defaultValue THEN return undefined', () => {
        const result = getLocalStorage('key1');
        expect(result).toBeUndefined();
    });

    test('WHEN apply with some key which not exist and defaultValue THEN return defaultValue', () => {
        const result = getLocalStorage('key1', 'defaultValue');
        expect(result).toBe('defaultValue');
    });
});

describe('GIVEN setLocalStorage func', () => {

    afterEach(() => {
        localStorage.clear();
    });

    test('WHEN apply with some key and value THEN return true and can get the value with that key', () => {
        const result = setLocalStorage('key1', 'value');

        expect(result).toBeTruthy();
        expect(getLocalStorage('key1')).toBe('value');
    });

    test('WHEN apply with some error THEN return false and not set that value', () => {
        const omegaObj = {};
        omegaObj.prop = omegaObj;
        const result = setLocalStorage('key1', omegaObj);
        expect(result).toBeFalsy();
        expect(getLocalStorage('key1')).toBeUndefined();
    });
});