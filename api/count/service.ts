import { Injectable, type Logger } from "@multiplatform.one/typegraphql";

@Injectable()
export class CountService {
  constructor(private readonly logger: Logger) {}

  async hello() {
    this.logger.info("hello");
    return "world";
  }
}
