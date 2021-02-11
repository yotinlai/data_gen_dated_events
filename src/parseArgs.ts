import * as fs from 'fs';
import * as Helpers from './helpers';

const { exit } = require('process');

import { ArgumentParser } from 'argparse';
const { version } = require('../package.json');

import {LocalDate } from  "@js-joda/core";

import * as seedrandom from 'seedrandom';

export class ParsedArgs {
	nrpersons : number;
	zero : boolean;
	stopRecords : boolean;
	output : string;
	period : number;
	userHierarchy : boolean;
}

export function parseArguments(explicitArgs : string) {
	const parser = new ArgumentParser( {
	description: "date_gen_dated_events, generate HR data"
	});
	parser.add_argument('-v', '--version', { action: 'version', version });
	parser.add_argument('-n', '--nrpersons', { action : 'store', type: "int", help: 'Number of persons' , default: 2 });
	parser.add_argument('-z', '--zero', { action: 'store_true',  help: 'write zero lines ( one record each month) .Z. ' });
	parser.add_argument('-s', '--stopRecords', { action: 'store_true', help: 'write stop records, default extension .S. ' });
	parser.add_argument('-o', '--output', { action : 'store', help: 'output prefix, default MONAG_<nrpers>.Z.csv , RANGE_<nrpers>.xx' });
	parser.add_argument('-p', '--period', { action: 'store', type: "int", default : 150,  help: 'Event period write zero lines ( one reacord each month) .Z. ' });
	parser.add_argument('-u', '--userHierarchy', { action: 'store_true', help: 'generate hierarchy for nrpersons (DIM_USER_<xxxx>.csv) ' });

	var args = parser.parse_args( explicitArgs? explicitArgs.split(' ')  : undefined);

	//console.log(JSON.stringify(args));
	return JSON.parse(JSON.stringify(args)) as ParsedArgs;
}


export class OutputParams {
	NRPERS : string;
	AVG_NEXT : number;
	FILENAME_MONAG : string;
	FILENAME_MONAG_C : string;
	FILENAME_RANGE : string;
	FILENAME_RANGE_C : string;
	NOZERO : boolean;
	STOPRECORDs: boolean;
}

export function getOutputParams( args: ParsedArgs ) {

	var o = new OutputParams();
	var BASEFILENAME = args.output || '';
	if ( BASEFILENAME.length && !BASEFILENAME.endsWith('_')) {
		BASEFILENAME += '_';
	}

	o.AVG_NEXT = args.period;

	var SUFFIX = Helpers.padZeros(o.AVG_NEXT,4) + '_'  + Helpers.padZeros(args.nrpersons,6)

	o.NOZERO = !args.zero;
	o.STOPRECORDs = args.stopRecords;

	var ext = "." + (o.NOZERO ? "" :  "Z.")  +   (o.STOPRECORDs ? "S." : "") + "csv";
	var extc = "." + (o.NOZERO ? "" :  "Z.")  +   (o.STOPRECORDs ? "S." : "") + "C.csv";

	o.FILENAME_MONAG = BASEFILENAME + "MONAG_" +  SUFFIX +  ext;
	o.FILENAME_MONAG_C = BASEFILENAME + "MONAG_" +  SUFFIX +  extc;
	o.FILENAME_RANGE = BASEFILENAME + "RANGE_" +  SUFFIX +  ext;
	o.FILENAME_RANGE_C = BASEFILENAME + "RANGE_" +  SUFFIX +  extc;
	return o;
}

export function dumpUserHierarchyIfRequested(args: ParsedArgs ) {
	if ( args.userHierarchy ) {
		Helpers.genUSERHierarchy(args.nrpersons);
	}
}

export function GetParams1(args: ParsedArgs) : Helpers.GenParams {
	var d1 = LocalDate.of(2020,1,6);
	var d2 = LocalDate.of(2024,6,1);

	var LOCATION_VALUES = { "NewYork" : 5,
	"LA" : 5,
	"Chicago" : 5,
	"Berlin" : 2,
	"Frankfurt" : 2,
	"Bangalore" :  2,
	"SFO" : 1
	};

	var ESTAT_VALUES = {
	"A" : 4,
	"U" : 1,
	"P" : 1,
	"S" : 2,
	};
	console.log(args);

	var pars = {
	NRPERS : args.nrpersons,
	AVG_NEXT : args.period,
	LOCCHANGE : 0.5,
	FTECHANGE : 0.5,
	ESTATCHANGE : 0.8,
	L_EVENT : 0.7,
	L_HIRE : 0.5,
	LOCATIONs : Helpers.makeMap(LOCATION_VALUES),
	ESTATs : Helpers.makeMap(ESTAT_VALUES),
	firstDate : d1,
	lastDate  : d2,
	random : seedrandom('abc'),
	randomOD : { "ESTAT" : seedrandom('XZY') },
	REOP_ESTATS :  ["A","U","P"],
	wsMONAG : undefined,
	wsRANGE : undefined,
	optsMONAG : {
		noZero : !args.zero,
		stopRecords : args.stopRecords
		}
	} as Helpers.GenParams;
	return pars;
}

export function GeneratePersons( pars: Helpers.GenParams, o : OutputParams ) {
	pars.wsMONAG = Helpers.getWS(o.FILENAME_MONAG);
	pars.wsRANGE = Helpers.getWS(o.FILENAME_RANGE);
	Helpers.writeHeader(pars.wsMONAG);
	Helpers.writeHeader(pars.wsRANGE);
	for(var p = 1; p < pars.NRPERS; ++p) {
		var pn = Helpers.genUser(p);
		Helpers.genPerson(pn, pars);
	}

	pars.wsMONAG.ws.on('finish', () => {
		console.log('Wrote data to file ' + o.FILENAME_MONAG );
		Helpers.cleanseWSInFile(o.FILENAME_MONAG, o.FILENAME_MONAG_C, function() {
			console.log('Wrote cleansed file to ' + o.FILENAME_MONAG_C );
		});
	});
	pars.wsRANGE.ws.on('finish', () => {
		console.log('Wrote data to file ' + o.FILENAME_RANGE );
		Helpers.cleanseWSInFile(o.FILENAME_RANGE, o.FILENAME_RANGE_C, function() {
			console.log('Wrote cleansed file to ' + o.FILENAME_RANGE_C );
		});
	});

	pars.wsMONAG.ws.end();
	pars.wsRANGE.ws.end();
}
