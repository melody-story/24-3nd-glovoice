import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app)
  app.useGlobalPipes(new ValidationPipe({//validator
    whitelist : true,
    forbidNonWhitelisted : true,
    transform: true
  })
  );
  const options = new DocumentBuilder()//swagger
    .setTitle('Glovoice API')
    .setDescription('Glovoice API')
    .setVersion('1.0.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  app.enableCors(//Cors 지정
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  ); 
    await app.listen(3000);
}
bootstrap();