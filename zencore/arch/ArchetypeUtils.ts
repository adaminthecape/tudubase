import { ItemTypes, FieldData, ArchetypeData } from "../ItemTypes";
import { Uuid } from "../Utils";

export class ArchetypeUtils
{
	public static getDummyArchetype(
		itemType: ItemTypes,
		itemFields: FieldData[]
	): ArchetypeData
	{
		return {
			id: Uuid.generateUuid(),
			typeId: ItemTypes.Archetype,
			name: itemType,
			itemType: itemType,
			attachedFields: itemFields.map((field) => field.id),
			scopeId: null,
		};
	}
}