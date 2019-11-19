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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { CarryoverApiModel } from '../model/carryoverApiModel';
import { LimitApiModel } from '../model/limitApiModel';
import { PasswordChangeApiModel } from '../model/passwordChangeApiModel';
import { PasswordResetApiModel } from '../model/passwordResetApiModel';
import { RequestedHoursApiModel } from '../model/requestedHoursApiModel';
import { UserApiModel } from '../model/userApiModel';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class UserService {

    protected basePath = '/';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Change user password
     * 
     * @param body User old and new password
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public changePassword(body: PasswordChangeApiModel, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public changePassword(body: PasswordChangeApiModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public changePassword(body: PasswordChangeApiModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public changePassword(body: PasswordChangeApiModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling changePassword.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/user/changePassword`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get all users
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllUsers(observe?: 'body', reportProgress?: boolean): Observable<Array<UserApiModel>>;
    public getAllUsers(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<UserApiModel>>>;
    public getAllUsers(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<UserApiModel>>>;
    public getAllUsers(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<UserApiModel>>(`${this.basePath}/user/getAll`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get user carryover for specified leave type and year
     * 
     * @param userId User ID
     * @param leaveTypeId ID of the leave type
     * @param year Year (current year if not specified)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCarryover(userId: string, leaveTypeId: string, year?: number, observe?: 'body', reportProgress?: boolean): Observable<CarryoverApiModel>;
    public getCarryover(userId: string, leaveTypeId: string, year?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CarryoverApiModel>>;
    public getCarryover(userId: string, leaveTypeId: string, year?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CarryoverApiModel>>;
    public getCarryover(userId: string, leaveTypeId: string, year?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling getCarryover.');
        }

        if (leaveTypeId === null || leaveTypeId === undefined) {
            throw new Error('Required parameter leaveTypeId was null or undefined when calling getCarryover.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (year !== undefined && year !== null) {
            queryParameters = queryParameters.set('year', <any>year);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<CarryoverApiModel>(`${this.basePath}/user/${encodeURIComponent(String(userId))}/carryover/${encodeURIComponent(String(leaveTypeId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get user individual limit
     * 
     * @param userId User ID
     * @param leaveTypeId ID of the leave type
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLimit(userId: string, leaveTypeId: string, observe?: 'body', reportProgress?: boolean): Observable<LimitApiModel>;
    public getLimit(userId: string, leaveTypeId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LimitApiModel>>;
    public getLimit(userId: string, leaveTypeId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LimitApiModel>>;
    public getLimit(userId: string, leaveTypeId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling getLimit.');
        }

        if (leaveTypeId === null || leaveTypeId === undefined) {
            throw new Error('Required parameter leaveTypeId was null or undefined when calling getLimit.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<LimitApiModel>(`${this.basePath}/user/${encodeURIComponent(String(userId))}/limit/${encodeURIComponent(String(leaveTypeId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get currently logged user
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLoggedUser(observe?: 'body', reportProgress?: boolean): Observable<UserApiModel>;
    public getLoggedUser(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<UserApiModel>>;
    public getLoggedUser(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<UserApiModel>>;
    public getLoggedUser(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<UserApiModel>(`${this.basePath}/user/me`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get user requested hours for specified leave type and year
     * 
     * @param userId User ID
     * @param leaveTypeId ID of the leave type
     * @param year Year (current year if not specified)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getRequestedHours(userId: string, leaveTypeId: string, year?: number, observe?: 'body', reportProgress?: boolean): Observable<RequestedHoursApiModel>;
    public getRequestedHours(userId: string, leaveTypeId: string, year?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RequestedHoursApiModel>>;
    public getRequestedHours(userId: string, leaveTypeId: string, year?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RequestedHoursApiModel>>;
    public getRequestedHours(userId: string, leaveTypeId: string, year?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling getRequestedHours.');
        }

        if (leaveTypeId === null || leaveTypeId === undefined) {
            throw new Error('Required parameter leaveTypeId was null or undefined when calling getRequestedHours.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (year !== undefined && year !== null) {
            queryParameters = queryParameters.set('year', <any>year);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<RequestedHoursApiModel>(`${this.basePath}/user/${encodeURIComponent(String(userId))}/requestedHours/${encodeURIComponent(String(leaveTypeId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get user by ID
     * 
     * @param id User ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUserById(id: string, observe?: 'body', reportProgress?: boolean): Observable<UserApiModel>;
    public getUserById(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<UserApiModel>>;
    public getUserById(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<UserApiModel>>;
    public getUserById(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getUserById.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<UserApiModel>(`${this.basePath}/user/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get if user with given ID is approver/supervisor of some other user
     * 
     * @param id User ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public isApprover(id: string, observe?: 'body', reportProgress?: boolean): Observable<boolean>;
    public isApprover(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<boolean>>;
    public isApprover(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<boolean>>;
    public isApprover(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling isApprover.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<boolean>(`${this.basePath}/user/${encodeURIComponent(String(id))}/isApprover`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Reset user password
     * 
     * @param body User email
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public resetPassword(body: PasswordResetApiModel, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public resetPassword(body: PasswordResetApiModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public resetPassword(body: PasswordResetApiModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public resetPassword(body: PasswordResetApiModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling resetPassword.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/user/resetPassword`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
