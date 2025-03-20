// Zencore: FIELD VALIDATION

import { FieldHandler } from "./Field";
import { FieldData, FieldType, FieldValidation } from "./ItemTypes";
import { RamDatabase } from "./MemoryDatabase";
import { Utils, Uuid } from "./Utils";

export type KnownValidationRules = keyof FieldValidation;
export type ValidationResult = (true | string);
export type ValidatorFunction = (opts: FieldValidatorFnOpts) => (true | string);
export type FieldValidatorFnOpts = { val: unknown; field: FieldData | undefined; };
export type TransformFunction<TIn = unknown, TOut = unknown> = (val: TIn) => (TOut | undefined);
export type FieldValidatorOpts = {
	fieldsArray?: Array<FieldData>;
	fieldsMap?: Record<string, FieldData>;
};
const transforms: Record<string, TransformFunction> = {
	toNumber: Utils.toNumber,
	toString: (val: unknown) => ((typeof val === 'string') ? val : undefined),
};
const fieldTypeTransforms: Partial<Record<FieldType, TransformFunction>> = {
	// text: transforms.toString,
	// textarea: transforms.toString,
	number: transforms.toNumber,
	timestamp: transforms.toNumber,
	// radio: undefined,
	// checkbox: undefined,
	// dropdown: undefined,
	// readonly: undefined,
	// repeater: undefined,
	// uuid: undefined,
	// uuidArray: undefined,
	// item: undefined,
	// itemArray: undefined,
};
const validators: Record<KnownValidationRules | string, ValidatorFunction> = {
	required: (opts: FieldValidatorFnOpts): ValidationResult =>
	{
		const { val, field } = opts;

		return (
			typeof val === 'undefined' ||
			val === null ||
			val === '' ||
			(Array.isArray(val) && !val.length)
		) ? 'You must enter a value' : true;
	},
	options: (opts: FieldValidatorFnOpts): ValidationResult =>
	{
		const { val, field } = opts;

		if(!Array.isArray(field?.options))
		{
			return 'No options to validate';
		}

		if(Array.isArray(val))
		{
			if(!val.every((v) => field.options?.includes(v)))
			{
				return 'Values mismatch';
			}
		}
		else if((typeof val === 'string') || (typeof val === 'number'))
		{
			// `==` to compare strings & numbers
			if(!field.options?.some((opt) => (opt == val)))
			{
				return 'Invalid selection';
			}
		}

		return true;
	},
	between: (opts: FieldValidatorFnOpts): ValidationResult =>
	{
		const { val, field } = opts;

		if(!field?.validation?.between)
		{
			return true;
		}

		if(Array.isArray(opts.val))
		{
			return Utils.numberBetween({
				min: field.validation.between.min,
				max: field.validation.between.max,
				value: opts.val.length
			});
		}

		if([
			FieldType.number,
			FieldType.timestamp
		].includes(field.fieldType as FieldType))
		{
			return Utils.numberBetween({
				min: field.validation.between.min,
				max: field.validation.between.max,
				value: val
			});
		}

		return Utils.stringBetween({
			min: field.validation.between.min,
			max: field.validation.between.max,
			value: val
		});
	},
	isBoolean: (opts: FieldValidatorFnOpts) => 
	{
		const { val, field } = opts;

		return (typeof val === 'boolean') || 'Must be a string';
	},
	isString: (opts: FieldValidatorFnOpts) => 
	{
		const { val, field } = opts;

		return (typeof val === 'string') || 'Must be a string';
	},
	isNumber: (opts: FieldValidatorFnOpts) => 
	{
		const { val, field } = opts;

		if(!Utils.toNumber(val))
		{
			return 'Must be a number';
		}

		return true;
	},
	isArray: (opts: FieldValidatorFnOpts) => 
	{
		const { val, field } = opts;

		return Array.isArray(val) || 'Must be an array';
	},
	isObject: (opts: FieldValidatorFnOpts) => 
	{
		const { val, field } = opts;

		return Boolean(
			typeof val === 'object' &&
			val &&
			!Array.isArray(val)
		) || 'Must be an object';
	},
	isTimestamp: (opts: FieldValidatorFnOpts) =>
	{
		const { val, field } = opts;

		return (
			Number.isInteger(Utils.toNumber(val)) &&
			(val as number) > 1e9
		) || 'Must be a timestamp';
	},
	isUuid: (opts: FieldValidatorFnOpts) =>
	{
		const { val, field } = opts;

		return Uuid.isUuid(val) || 'Must be an ID';
	},
	isUuidArray: (opts: FieldValidatorFnOpts) =>
	{
		const { val, field } = opts;

		return (
			Array.isArray(val) &&
			val.every(Uuid.isUuid)
		) || 'Must be a list of IDs';
	},
	isItemFilterArray: (opts: FieldValidatorFnOpts) =>
	{
		return Array.isArray(opts.val) && opts.val.every((f) =>
		{
			return Utils.isSingleFilter(f) || Utils.isGroupFilter(f);
		}) || 'Must be a valid array of filters or filter groups';
	},
	isPrimitive: (opts: FieldValidatorFnOpts) =>
	{
		const { val, field } = opts;

		return (
			typeof val === 'string' ||
			typeof val === 'number' ||
			typeof val === 'boolean'
		) || 'Must be a primitive';
	},
	isPrimitiveArray: (opts: FieldValidatorFnOpts) =>
	{
		const { val, field } = opts;

		return (
			Array.isArray(val) &&
			val.every((v) => (
				typeof v === 'string' ||
				typeof v === 'number' ||
				typeof v === 'boolean'
			))
		) || 'Must be a primitive array';
	},
};
const fieldTypeValidators: Record<FieldType, ValidatorFunction> = {
	text: validators.isString,
	textarea: validators.isString,
	number: validators.isNumber,
	timestamp: validators.isTimestamp,
	radio: validators.isPrimitive,
	readonly: () => 'Field is readonly',
	repeater: (opts: FieldValidatorFnOpts) => true,
	dropdown: (opts: FieldValidatorFnOpts) => (
		validators.isPrimitive(opts) ||
		'Must be a valid dropdown'
	),
	multiSelect: (opts: FieldValidatorFnOpts) => (
		validators.isPrimitiveArray(opts) ||
		'Must be a valid dropdown array'
	),
	checkbox: validators.isArray,
	toggle: validators.isBoolean,
	item: validators.isUuid,
	itemArray: validators.isUuidArray,
	itemFilters: validators.isItemFilterArray,
	fieldType: (opts: FieldValidatorFnOpts) =>
	{
		return (
			(typeof opts.val === 'string') &&
			Object.values(FieldType).includes(opts.val as FieldType)
		) || 'Must be a known field type';
	},
	itemType: (opts: FieldValidatorFnOpts) =>
	{
		return !!(
			// disabled because item types are dynamic and must come from the db
			// Object.values(ItemType).includes(opts.val as ItemType) &&
			opts.val && (typeof opts.val === 'string')
		) || 'Must be a known item type';
	}
};
/**
 * Use the FieldValidator class to validate data according to Field definitions.
 * You need to give it a list of fields or field IDs, which will be converted to
 * Field data for consumption. You should always use `getInstance()` to ensure
 * that your field data is loaded - validation fails when the field is missing.
 */
export class FieldValidator
{
	public fieldIds: Array<string>;
	public fields?: Record<string, FieldData> | undefined;

	/**
	 * Given an array of field handlers or their data, return
	 * an associative array of handlers, keyed by field ID.
	 * @param fieldArray
	 * @returns
	 * @deprecated
	 */
	public static deriveFieldHandlers(
		fieldArray: Array<FieldHandler | FieldData>
	): Record<string, FieldHandler>
	{
		if(!Array.isArray(fieldArray))
		{
			return {};
		}

		return fieldArray.reduce((
			agg: Record<string, FieldHandler>,
			field: FieldHandler | FieldData
		) =>
		{
			if(field instanceof FieldHandler)
			{
				agg[field.id] = field;
			}
			else if(Utils.isPopulatedObject(field))
			{
				agg[field.id] = new FieldHandler({
					id: field.id,
					// TODO: hook up to actual db, if necessary
					db: new RamDatabase({}),
					initialData: field as FieldData
				});
			}

			return agg;
		}, {});
	}

	/**
	 * Given a field, return an array of KnownValidationRules, which
	 * you can then map to validation handler functions as needed.
	 * @param field
	 * @returns
	 */
	public static generateInputRuleNames(
		field: FieldHandler | FieldData
	): KnownValidationRules[]
	{
		let fieldData;

		if(field instanceof FieldHandler)
		{
			fieldData = field.getData();
		}
		else if(Utils.isPopulatedObject(field))
		{
			fieldData = field;
		}

		if(!fieldData?.validation)
		{
			return [];
		}

		return Object.keys(fieldData.validation) as KnownValidationRules[];
	}

	public static async mapFieldIdsToData(opts: {
		db: RamDatabase;
		fieldDataOrIds: Array<(FieldData | string)>;
	}): Promise<Record<string, FieldData>>
	{
		const { db, fieldDataOrIds: fieldDataArray } = opts;

		if(!(
			db &&
			Array.isArray(fieldDataArray) &&
			fieldDataArray.length
		))
		{
			return {};
		}

		const fieldIds = Utils.retrieveFieldIds(fieldDataArray);

		if(!fieldIds?.length)
		{
			return {};
		}

		const fieldsFromDb = await db.selectMultiple({
			itemType: 'Field',
			itemIds: fieldIds
		});

		if(!Array.isArray(fieldsFromDb?.results))
		{
			return {};
		}

		const results: (Record<string, FieldData>) = {};

		fieldsFromDb.results.forEach((f) =>
		{
			if(
				Utils.isPopulatedObject(f) &&
				typeof f?.id === 'string' &&
				!results[f.id]
			)
			{
				(results as Record<string, unknown>)[f.id] = f;
			}
		});

		fieldDataArray.forEach((f) =>
		{
			if(
				Utils.isPopulatedObject(f) &&
				f?.id &&
				!results[f.id]
			)
			{
				(results as Record<string, FieldData>)[f.id] = f;
			}
		});

		return results;
	}

	public static retrieveFieldIds = Utils.retrieveFieldIds;
	public static validateRequired = validators.required;
	public static validateOptions = validators.options;
	public static validateBetween = validators.between;
	public static validateIsBoolean = validators.isBoolean;
	public static validateIsArray = validators.isArray;
	public static validateIsNumber = validators.isNumber;
	public static validateIsString = validators.isString;
	public static validateIsTimestamp = validators.isTimestamp;
	public static validateIsObject = validators.isObject;
	public static validateIsUuid = validators.isUuid;
	public static validateIsUuidArray = validators.isUuidArray;
	public static validateIsItemFilterArray = validators.isItemFilterArray;

	public static async getInstance(opts: FieldValidatorOpts & {
		db: RamDatabase;
	}): Promise<FieldValidator>
	{
		const instance = new FieldValidator(opts);

		await instance.loadFields(opts);

		return instance;
	}

	constructor(opts: FieldValidatorOpts)
	{
		let fieldIds;

		if(opts.fieldsArray)
		{
			fieldIds = Utils.retrieveFieldIds(opts.fieldsArray);
		}
		else if(opts.fieldsMap)
		{
			fieldIds = Utils.retrieveFieldIds(Object.values(opts.fieldsMap));
		}

		if(!fieldIds)
		{
			throw new Error('Must provide fields');
		}

		this.fieldIds = fieldIds;
	}

	protected async loadFields(opts: {
		db: RamDatabase;
	}): Promise<void>
	{
		const fields = await FieldValidator.mapFieldIdsToData({
			db: opts.db,
			fieldDataOrIds: this.fieldIds as string[]
		});

		if(!(Array.isArray(fields) && fields.length))
		{
			console.warn(`Failed to load fields ${this.fieldIds.join(',')}`);
		}

		this.fields = fields;
	}

	/**
	 * TODO:
	 * Use this function to validate a key-value pair against its field
	 * It should fail if the field does not exist on the instance
	 * It should succeed if the value is null
	 * It should transform the value if needed, based on the field type
	 *  (e.g. if field type is number, but given a number as a string, accept it as a number)
	 * Should be able to:
	 * - Set a list of fields on an Item (which extends Archetype)
	 * - Give an object to setData()
	 * - Validate all properties in the data with this function
	 * - Ensure valid data structure from any starting point, recursively
	 * @param opts 
	 * @returns 
	 */
	public validateForKey(opts: FieldValidatorFnOpts): ValidationResult
	{
		const { val, field } = opts;

		// need to ensure this validates any primitive by its field type
		switch(field?.fieldType)
		{
			// Unhandled as yet:
			case FieldType.checkbox:
			case FieldType.radio:
				return `Unhandled field type ${field?.fieldType}`;
			case FieldType.multiSelect:
				return validators.isPrimitiveArray(opts);
			case FieldType.dropdown:
				return validators.options(opts);
			case FieldType.number:
				return validators.isNumber(opts);
			case FieldType.text:
			case FieldType.textarea:
				return validators.isString(opts);
			case FieldType.timestamp:
				return validators.isTimestamp(opts);
			case FieldType.item:
				return validators.isUuid(opts);
			case FieldType.itemArray:
				return validators.isUuidArray(opts);
			case FieldType.repeater:
				return validators.isArray(opts);
			case FieldType.readonly:
				return 'Field is readonly';
			default:
				return `Unknown field type ${field?.fieldType} (1)`;
		}
	}

	public transformByFieldType(opts: FieldValidatorFnOpts): unknown
	{
		const { val, field } = opts;
		const type = field?.fieldType as FieldType;

		if(!type || (typeof fieldTypeTransforms[type] !== 'function'))
		{
			return val;
		}

		opts.val = fieldTypeTransforms[type](val);
	}

	public validateByFieldType(opts: FieldValidatorFnOpts): ValidationResult
	{
		const { val, field } = opts;

		if(
			!field?.fieldType ||
			(typeof fieldTypeValidators[field.fieldType as FieldType] !== 'function')
		)
		{
			return `Unknown field type ${field?.fieldType} (2)`;
		}

		return fieldTypeValidators[field.fieldType as FieldType]({ val, field });
	}

	public validateRepeater(opts: FieldValidatorFnOpts): ValidationResult
	{
		const { val, field } = opts;

		if(val === null)
		{
			return true;
		}

		if(!Array.isArray(val))
		{
			return 'Must be an array of values';
		}

		if(!(Array.isArray(field?.children) && field.children.length))
		{
			return 'No fields to compare';
		}

		// we should have all the fields loaded, including repeater children
		// we need to map the repeater child ids to their fields
		// and use a new Validator to test each child item
		const fieldKeyToIdMap: Record<string, string> = {};
		const fieldsMap = field.children.reduce((agg: Record<string, FieldData>, childId) =>
		{
			if(this.fields?.[childId]?.key)
			{
				agg[childId] = this.fields[childId];
				fieldKeyToIdMap[this.fields[childId].key] = childId;
			}

			return agg;
		}, {});

		const subValidator = new FieldValidator({ fieldsMap });
		let failedMessage;

		for(const entry of val)
		{
			for(const key of Object.keys(entry))
			{
				const { success, message } = subValidator.validateField({
					fieldId: fieldKeyToIdMap[key],
					value: entry
				});

				if(!success)
				{
					failedMessage = message;

					break;
				}
			}

			if(failedMessage)
			{
				break;
			}
		}

		if(failedMessage)
		{
			return failedMessage;
		}

		return true;
	}

	public validateField(opts: {
		value: unknown;
	} & ({
		fieldId: string;
	} | {
		field: FieldData;
	})): ({
		success: boolean;
		message?: string;
	})
	{
		if(!('fieldId' in opts) && !('field' in opts))
		{
			return { success: false, message: 'No field data available' };
		}

		let field;

		if('fieldId' in opts)
		{
			field = this.fields?.[opts.fieldId];
		}
		else if('field' in opts)
		{
			field = opts.field;
		}

		if(!field?.fieldType)
		{
			return { success: false, message: 'Unknown field type' };
		}

		const payload = { val: opts.value, field };

		this.transformByFieldType(payload);

		const typeValid = this.validateByFieldType(payload);

		if(typeValid !== true)
		{
			return { success: false, message: typeValid };
		}

		if((field.fieldType === FieldType.repeater))
		{
			// need to validate its child values against its child fields
			const isRepeaterValid = this.validateRepeater(payload);

			if(isRepeaterValid !== true)
			{
				return { success: false, message: isRepeaterValid };
			}
		}

		const rules = FieldValidator.generateInputRuleNames(field);

		if(!(Array.isArray(rules) && rules.length))
		{
			// no rules = nothing to fail on
			return { success: true };
		}

		let failureMessage;

		// evaluate rules, return the first failure
		for(const ruleName of rules)
		{
			const validatorName = `validate${ruleName.slice(0, 1).toUpperCase()
				}${ruleName.slice(1)
				}`;
			const validator = (FieldValidator)[
				validatorName as keyof typeof FieldValidator
			] as ValidatorFunction;

			if(typeof validator !== 'function')
			{
				console.error(`Unrecognised validator "${validatorName}" for "${ruleName}"`);

				continue;
			}

			const result = validator(payload);

			if(result !== true)
			{
				// rule failed
				failureMessage = result;

				break;
			}
		}

		if(typeof failureMessage === 'string')
		{
			return { success: false, message: failureMessage };
		}

		return { success: true };
	}
}