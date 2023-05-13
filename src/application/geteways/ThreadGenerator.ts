export interface ThreadGenerator {
  generate(transcript: string): Promise<string[]>
}
