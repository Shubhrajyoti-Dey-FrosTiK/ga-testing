import { model, Schema, Types, Document } from "mongoose";

/*-------- Activity ( Comment,Like ) --------*/

export interface Student extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  groups: Array<Schema.Types.ObjectId>;
}

const schema = new Schema<Student>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    timestamps: true,
  }
);

export const StudentModel = model<Student>("Student", schema);
