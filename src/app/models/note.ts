import { prop } from "@typegoose/typegoose";

export class Note {

  @prop()
  public content?: string;

  @prop()
  public isPublic?: boolean;
}