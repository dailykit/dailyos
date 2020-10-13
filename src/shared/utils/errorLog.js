import * as Sentry from '@sentry/react'

export const logger = error => {
   Sentry.captureException(error)
}
