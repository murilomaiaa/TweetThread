import { Document, MongoClient } from 'mongodb'

export class MongoHelper {
  private static client: MongoClient

  public static async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  }

  public static async disconnect(): Promise<void> {
    await this.client.close()
  }

  public static getCollection<T extends Document>(name: string) {
    return this.client.db().collection<T>(name)
  }
}
