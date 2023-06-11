import { model, Schema, Types, Document } from "mongoose";

/*-------- Activity ( Comment,Like ) --------*/

export interface Company extends Document {
  name: String;
  logo: Array<String>;
  address: String;
  category: String;
  sector: String;
  website?: String;
  companyTurnover?: String;
}

const schema = new Schema<Company>(
  {
    name: { type: String, required: true },
    logo: [{ type: String, required: true }],
    address: { type: String, required: true },
    category: { type: String, required: true },
    sector: { type: String, required: true },
    website: { type: String, required: false },
    companyTurnover: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const CompanyModel = model<Company>("Company", schema);
