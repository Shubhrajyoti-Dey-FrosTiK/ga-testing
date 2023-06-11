import { model, Schema, Types, Document } from "mongoose";

/*-------- Activity ( Comment,Like ) --------*/

export interface Recruiter extends Document {
  firstName: string;
  contact: string;
  gender: string;
  email: string;
  isActive: Boolean;
  company: Types.ObjectId;
  groups: Array<Types.ObjectId>;
  middleName?: string;
  alternateContact?: string;
  lastName?: string;
}

const schema = new Schema<Recruiter>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String },
    contact: { type: String },
    alternateContact: { type: String },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    timestamps: true,
  }
);

export const RecruiterModel = model<Recruiter>("Recruiter", schema);
