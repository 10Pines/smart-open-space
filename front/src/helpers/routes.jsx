import React from 'react';
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
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

export const RedirectToRoot = () => <Navigate to={toRoot} replace />;
export const RedirectToLogin = () => <Navigate to={toLogin} replace />;
export const RedirectToResetPassword = ({ email, token }) => (
  <Navigate to={toResetPassword(email, token)} replace />
);
export const RedirectToLoginFromOpenSpace = ({ openSpaceId }) => (
  <Navigate to={toLogin} state={{ openSpaceId }} replace />
);
export const RedirectToOS = ({ id }) => <Navigate to={useToOS(id)} replace />;
RedirectToOS.propTypes = { id: PropTypes.string.isRequired };

const pushTo = (navigate, path, state) => () => navigate(path, { state });
export const usePushToRoot = () => pushTo(useNavigate(), toRoot);
export const usePushToLogin = () => pushTo(useNavigate(), toLogin);
export const usePushToRegister = () => pushTo(useNavigate(), toRegister);
export const usePushToRecoveryEmail = () => pushTo(useNavigate(), toRecoveryEmail);
export const usePushToLoginFromOpenSpace = (openSpaceId) =>
  pushTo(useNavigate(), toLogin, { openSpaceId });
export const usePushToRegisterFromOpenSpace = (openSpaceId) =>
  pushTo(useNavigate(), toRegister, { openSpaceId });
export const usePushToMyTalks = (id) => pushTo(useNavigate(), useToMyTalks(id));
export const usePushToNewOS = () => pushTo(useNavigate(), toNewOS);
export const usePushToOpenSpace = (id) => pushTo(useNavigate(), useToOS(id));
export const usePushToTalk = (id, talkId, speakerName = null) =>
  pushTo(useNavigate(), useToTalk(id, talkId, speakerName));
export const usePushToNewTalk = (id) => pushTo(useNavigate(), useToNewTalk(id));
export const usePushToProjector = (id) => pushTo(useNavigate(), useToProjector(id));
export const usePushToSchedule = (id) => pushTo(useNavigate(), useToSchedule(id));
export const usePushToEditTalk = (talkId, openSpaceId) =>
  pushTo(useNavigate(), useToEditTalk(talkId, openSpaceId));
export const usePushToEditOS = (openSpaceId) =>
  pushTo(useNavigate(), useToEditOS(openSpaceId));

export const useInRegister = () => useLocation().pathname === toRegister;
