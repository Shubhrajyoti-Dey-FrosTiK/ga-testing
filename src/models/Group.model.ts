import { model, Schema, Types, Document } from "mongoose";

/*-------- Activity ( Comment,Like ) --------*/

export interface Group extends Document {
  name: String;
  roles: Array<String>;
}

const schema = new Schema<Group>(
  {
    name: { type: String, required: true },
    roles: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const GroupModel = model<Group>("Group", schema);
