import { CoreDependencies } from '@core/dependecies';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authProviders } from './auth/providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...CoreDependencies.modulesCollection()
  ],
  controllers: [],
  providers: [
    ...CoreDependencies.providersCollection(),
    ...authProviders()
  ],
})
export class AppModule { }
