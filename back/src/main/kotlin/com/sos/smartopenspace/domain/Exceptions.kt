package com.sos.smartopenspace.domain

open class BadRequestException(message: String?) : RuntimeException(message)
open class NotFoundException(message: String) : BadRequestException(message)
open class UnprocessableEntityException(message: String?) : RuntimeException(message)
/**
 * It is a RuntimeException. Handles 401 (Unauthorized) http status code in ExceptionHandler.
 * Semantic should be invalid auth session and client should perform a new login.
 */
open class UnauthorizedException(message: String) : RuntimeException(message)
open class ForbiddenException(message: String) : RuntimeException(message)

class AlreadyActivedQueuingException : BadRequestException("Encolamiento ya se encuentra activo")
class AnotherTalkIsEnqueuedException : BadRequestException("Existe otra charla encolada")
class BusySlotException : BadRequestException("Slot ocupado")
class CantFinishTalkException : BadRequestException("No podes terminar la charla actual")
class EmptyQueueException : BadRequestException("La cola de charlas está vacía")
class FinishedQueuingException : BadRequestException("Encolamiento finalizado")
class InactiveQueueException : BadRequestException("No está activo el encolamiento")
class TalkAlreadyAssignedException : BadRequestException("Charla ya está agendada")
class TalkAlreadyEnqueuedException : BadRequestException("Charla ya está encolada")
class TalkDoesntBelongException : BadRequestException("Charla no pertenece al Open Space")
class TalkIsNotForScheduledException : BadRequestException("Charla no está para agendar")
class TalkIsNotScheduledException : BadRequestException("Charla no está agendada")
class CallForPapersClosedException : UnprocessableEntityException("La convocatoria se encuentra cerrada")
class NotValidTrackForOpenSpaceException : BadRequestException("El track de la charla no pertenece a este open space")
class UserDidntVoteThisTalkException : BadRequestException("Este usuario no voto esta charla")

class UserNotOwnerOfTalkException : ForbiddenException("El usuario no es el dueño de la charla")
class UserNotOwnerOfOpenSpaceException : ForbiddenException("El usuario no es el dueño del openspace")
class UserNotBelongToAuthToken: ForbiddenException("No tienes permisos para acceder a este recurso")
class NotTheOrganizerException : ForbiddenException("No sos el organizador")

class OpenSpaceNotFoundException : NotFoundException("OpenSpace no encontrado")
class TalkNotFoundException : NotFoundException("Charla no encontrada")
class RoomNotFoundException : NotFoundException("Sala no encontrada")
class TrackNotFoundException : NotFoundException("Track no encontrado")
class UserNotFoundException : NotFoundException("Usuario incorrecto")
class SlotNotFoundException : NotFoundException("No existe un slot en ese horario")

class UserUnauthorizedException : UnauthorizedException("Usuario incorrecto")
class InvalidTokenException : UnauthorizedException("Token invalido")

class RepeatedReviewForTalkException : BadRequestException("Reviewer repetido para la charla")
class UserCannotVoteItsTalkException : BadRequestException("No puedes votar tu charla!")
