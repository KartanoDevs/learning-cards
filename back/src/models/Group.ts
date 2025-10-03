import { Schema, model, Document } from 'mongoose';

export interface GroupDoc extends Document {
  name: string;
  slug: string;
  iconUrl?: string | null;
  order?: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<GroupDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    iconUrl: { type: String, default: null },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GroupSchema.index({ enabled: 1, order: 1 });

export const Group = model<GroupDoc>('Group', GroupSchema);
