import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1714574063072 implements MigrationInterface {
    name = 'CreateInitialTables1714574063072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" SERIAL NOT NULL,
                "parent_id" integer,
                "code" character varying(15) NOT NULL,
                "name" character varying(50) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_Organizations" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_Organizations_Code" ON "organizations" ("code")
            WHERE deleted_at is null
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SMALLSERIAL NOT NULL,
                "organization_id" integer,
                "name" character varying(50) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "display_name" character varying(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_Roles_Name" UNIQUE ("name"),
                CONSTRAINT "PK_Roles" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_Roles_Name" ON "roles" ("name")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_Roles_OrganizationId_Name" ON "roles" ("organization_id", "name")
            WHERE deleted_at is null
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGSERIAL NOT NULL,
                "user_name" character varying(50) NOT NULL,
                "first_name" character varying(50) NOT NULL,
                "last_name" character varying(50) NOT NULL,
                "email" character varying(50) NOT NULL,
                "phone" character varying(20) NOT NULL,
                "password" character varying(100) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_Users_UserName" UNIQUE ("user_name"),
                CONSTRAINT "UQ_Users_Email" UNIQUE ("email"),
                CONSTRAINT "UQ_Users_Phone" UNIQUE ("phone"),
                CONSTRAINT "PK_Users" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(` 
            CREATE TABLE "otp_code_types" (
                "id" SMALLSERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_OtpCodeTypes" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "otp_codes" (
                "id" BIGSERIAL NOT NULL,
                "user_id" bigint NOT NULL,
                "otp_code_type_id" smallint NOT NULL,
                "destination" character varying(50),
                "token" character varying(100) NOT NULL,
                "expire_time" date,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_OtpCodes" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_OtpCodes_Token" ON "otp_codes" ("token")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_OtpCodes_UserId_OtpCodeTypeId" ON "otp_codes" ("user_id", "otp_code_type_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" BIGSERIAL NOT NULL,
                "user_id" bigint NOT NULL,
                "role_id" smallint NOT NULL,
                "token" character varying(100) NOT NULL,
                "expire_time" date,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_RefreshTokens_Token" ON "refresh_tokens" ("token")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_RefreshTokens_UserId_RoleId" ON "refresh_tokens" ("user_id", "role_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" bigint NOT NULL,
                "role_id" smallint NOT NULL,
                CONSTRAINT "PK_UsersRoles" PRIMARY KEY ("user_id", "role_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_UsersRoles_UserId" ON "users_roles" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_UsersRoles_RoleId" ON "users_roles" ("role_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "organizations"
            ADD CONSTRAINT "FK_Organizations_Organizations" FOREIGN KEY ("parent_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
        `);
        await queryRunner.query(`
            ALTER TABLE "roles"
            ADD CONSTRAINT "FK_Roles_Organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "otp_codes"
            ADD CONSTRAINT "FK_OtpCodes_OtpCodeTypes" FOREIGN KEY ("otp_code_type_id") REFERENCES "otp_code_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_UsersRoles_Users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_UsersRoles_Roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_UsersRoles_Roles"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_UsersRoles_Users"
        `);
        await queryRunner.query(`
            ALTER TABLE "otp_codes" DROP CONSTRAINT "FK_OtpCodes_OtpCodeTypes"
        `);
        await queryRunner.query(`
            ALTER TABLE "roles" DROP CONSTRAINT "FK_Roles_Organizations"
        `);
        await queryRunner.query(`
            ALTER TABLE "organizations" DROP CONSTRAINT "FK_Organizations_Organizations"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_UsersRoles_RoleId"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_UsersRoles_UserId"
        `);
        await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_RefreshTokens_UserId_RoleId"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_RefreshTokens_Token"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_OtpCodes_UserId_OtpCodeTypeId"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_OtpCodes_Token"
        `);
        await queryRunner.query(`
            DROP TABLE "otp_codes"
        `);
        await queryRunner.query(`
            DROP TABLE "otp_code_types"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_Roles_OrganizationId_Name"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_Roles_Name"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_Organizations_Code"
        `);
        await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    }

}
