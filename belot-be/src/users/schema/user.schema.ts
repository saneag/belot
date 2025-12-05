import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      const typedRet = ret as unknown as { id?: string; _id?: string };
      typedRet.id = typedRet._id?.toString();
      delete typedRet._id;
      return typedRet;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      const typedRet = ret as unknown as { id?: string; _id?: string };
      typedRet.id = typedRet._id?.toString();
      delete typedRet._id;
      return typedRet;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 0 })
  gamesPlayed: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
