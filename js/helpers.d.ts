export declare const EXCELOFFSET = 25569;
import { LocalDate } from "@js-joda/core";
export declare function dateToDayIndex(d: LocalDate): number;
export declare function makeMap(obj: any): any[];
export declare class GenParams {
    AVG_NEXT: number;
    LOCCHANGE: number;
    FTECHANGE: number;
    L_HIRE: number;
    L_EVENT: number;
    locations: string[];
    firstDate: LocalDate;
    lastDate: LocalDate;
    random: any;
}
export declare class Person {
    user: string;
    dob: LocalDate;
    location: string;
    hired: number;
    hiredSOM: number;
    hiredPrev: number;
    fte: number;
    ftePrev: number;
    fteSOM: number;
    lastHired: LocalDate;
    lastRecorded: LocalDate;
    prevDateEnd: LocalDate;
}
export declare function dateIndexToDate(dateIdx: number): LocalDate;
export declare function copyDate(d: LocalDate): LocalDate;
export declare function isEOQ(d: LocalDate): boolean;
export declare function isEOY(d: LocalDate): boolean;
export declare function pad(a: any, len: number): string;
export declare function padSpace(a: any, len: number): string;
export declare function padSpaceQ(a: any, len: number): string;
export declare function asDate(dateIdx: any): string;
export declare function EOMONTH(d: LocalDate): LocalDate;
export declare function daysInMonth(d: any): number;
export declare function writeHeader(ws: any): void;
export declare function writeDay(ws: any, prevDateEnd: LocalDate, dateIdx: LocalDate): number;
export declare function diffYears(dateLow: LocalDate, dateHigh: LocalDate): number;
export declare function diffMonth(dateLow: LocalDate, dateHigh: LocalDate): number;
export declare function writeTENUREAGE(pers: Person): boolean;
export declare function writeTenure(ws: any, now: LocalDate, pers: Person, eom: any): void;
export declare function getSOM(dateIdx: LocalDate): LocalDate;
export declare function writeAge(ws: any, now: LocalDate, pers: any, eom: boolean): void;
export declare function writeTripel(ws: any, vsom: any, vnow: any, eom: boolean): void;
export declare function toDec1(n: number): string;
export declare function memorizeSOM(eom: boolean, pers: Person): void;
export declare function writeRecord(ws: any, dateIdx: LocalDate, pers: Person, comment: string): void;
export declare function isHireChange(pars: GenParams): boolean;
export declare function genPerson(ws: any, p: any, pars: GenParams): void;
