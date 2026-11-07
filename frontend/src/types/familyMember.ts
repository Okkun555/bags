/** 続柄(APIの値) */
export const relationships = [
  "me",
  "spouse",
  "mother",
  "father",
  "child",
  "other",
] as const;

export type Relationship = (typeof relationships)[number];

export const relationshipLabels: Record<Relationship, string> = {
  me: "本人",
  spouse: "配偶者",
  mother: "母",
  father: "父",
  child: "子",
  other: "その他",
};

export type FamilyMember = {
  id: number;
  name: string;
  relationship: Relationship;
  /** YYYY-MM-DD */
  birthday: string;
};
