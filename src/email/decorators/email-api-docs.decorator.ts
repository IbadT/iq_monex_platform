import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendEmailDto } from '../dto/send-email.dto';

// === SEND EMAIL ===
export const ApiSendEmailOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить email с выбором отправителя',
      description:
        'Универсальный метод для отправки email с возможностью выбора отправителя (NOREPLY или SUPPORT)',
    }),
    ApiBody({ type: SendEmailDto }),
    ApiResponse({
      status: 200,
      description: 'Email успешно отправлен',
      schema: {
        example: {
          success: true,
          message: 'Email успешно отправлен на user@example.com',
          messageId: '1234567890@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации или отправки email',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки email',
          error: 'SMTP connection failed',
        },
      },
    }),
  );

// === SEND VERIFICATION CODE ===
export const ApiSendVerificationCodeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить код подтверждения',
      description: 'Отправляет код подтверждения на указанный email адрес',
    }),
    ApiBody({
      schema: {
        example: {
          to: 'user@example.com',
          code: '123456',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Код подтверждения успешно отправлен',
      schema: {
        example: {
          success: true,
          message: 'Код подтверждения отправлен на user@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки кода подтверждения',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки кода подтверждения',
          error: 'Invalid email address',
        },
      },
    }),
  );

// === SEND WELCOME ===
export const ApiSendWelcomeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить приветственное письмо',
      description: 'Отправляет приветственное письмо новому пользователю',
    }),
    ApiBody({
      schema: {
        example: {
          to: 'user@example.com',
          userName: 'John Doe',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Приветственное письмо успешно отправлено',
      schema: {
        example: {
          success: true,
          message: 'Приветственное письмо отправлено на user@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки приветственного письма',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки приветственного письма',
          error: 'SMTP connection failed',
        },
      },
    }),
  );

// === SEND PASSWORD RESET ===
export const ApiSendPasswordResetOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить письмо для сброса пароля',
      description: 'Отправляет письмо со ссылкой для сброса пароля',
    }),
    ApiBody({
      schema: {
        example: {
          to: 'user@example.com',
          token: 'abc123def456',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Письмо для сброса пароля успешно отправлено',
      schema: {
        example: {
          success: true,
          message: 'Письмо для сброса пароля отправлено на user@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки письма для сброса пароля',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки письма для сброса пароля',
          error: 'Invalid token format',
        },
      },
    }),
  );

// === SEND SUPPORT REPLY ===
export const ApiSendSupportReplyOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить ответ поддержки',
      description: 'Отправляет ответ пользователя по тикету поддержки',
    }),
    ApiBody({
      schema: {
        example: {
          to: 'user@example.com',
          ticketId: 'TICKET-123',
          message:
            'Ваш вопрос решен. Если у вас есть дополнительные вопросы, пожалуйста, дайте нам знать.',
          agentName: 'John Smith',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ответ поддержки успешно отправлен',
      schema: {
        example: {
          success: true,
          message: 'Ответ поддержки отправлен на user@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки ответа поддержки',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки ответа поддержки',
          error: 'Invalid ticket ID',
        },
      },
    }),
  );

// === SEND 2FA CODE ===
export const ApiSend2FACodeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить 2FA код',
      description: 'Отправляет код двухфакторной аутентификации',
    }),
    ApiBody({
      schema: {
        example: {
          to: 'user@example.com',
          code: '654321',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '2FA код успешно отправлен',
      schema: {
        example: {
          success: true,
          message: '2FA код отправлен на user@example.com',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки 2FA кода',
      schema: {
        example: {
          success: false,
          message: 'Ошибка отправки 2FA кода',
          error: 'Rate limit exceeded',
        },
      },
    }),
  );
