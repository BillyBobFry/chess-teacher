/** Errors from the server and the engines, worded in the player's language (UX-32). */

import { PASSWORD_MIN_LENGTH } from "@chess-teacher/contract";
import { m } from "../paraglide/messages.js";
import { OpponentLoadError } from "../engine/maia.ts";
import { HttpError } from "./client.ts";

/** What to tell the player about a failed request or step. */
export function errorText(err: unknown): string {
  if (err instanceof HttpError) {
    switch (err.body.error) {
      case "internal":
        return m.error_api_internal();
      case "not_signed_in":
        return m.error_api_not_signed_in();
      case "invalid_request":
        return m.error_api_invalid_request();
      case "game_too_large":
        return m.error_api_game_too_large();
      case "illegal_move":
        return m.error_api_illegal_move();
      case "not_found":
        return m.error_api_not_found();
      case "conflict":
        return m.error_conflict();
      case "malformed_lesson":
        return m.error_api_malformed_lesson();
    }
    return m.error_generic();
  }
  if (err instanceof OpponentLoadError) return m.error_opponent_load();
  // fetch() rejects with a TypeError when the server can't be reached.
  if (err instanceof TypeError) return m.error_network();
  return m.error_generic();
}

/** Better Auth's error codes (better-auth/core BASE_ERROR_CODES), worded for the player. */
export function authErrorText(error: { code?: string; status: number }): string {
  if (error.status === 429) return m.auth_error_rate_limited();
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return m.auth_error_invalid_credentials();
    case "INVALID_EMAIL":
      return m.auth_error_invalid_email();
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return m.auth_error_email_taken();
    case "PASSWORD_TOO_SHORT":
      return m.auth_error_password_too_short({ min: PASSWORD_MIN_LENGTH });
    case "PASSWORD_TOO_LONG":
      return m.auth_error_password_too_long();
  }
  return m.error_generic();
}
