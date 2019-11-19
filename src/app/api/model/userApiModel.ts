/**
 * Evolveum Day Off Planner API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface UserApiModel { 
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly supervisor?: string;
    readonly admin: boolean;
    readonly jobDescription: string;
    readonly phone?: string;
    readonly approvers: Array<string>;
}