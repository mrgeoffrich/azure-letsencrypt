import * as bunyan from "bunyan";
import * as mongoose from 'mongoose';

export class Mongo {

    public Logger: bunyan;

    public constructor(logger: bunyan) {
        this.Logger = logger;
    }

    public Connect = async () => {
        const connectinString = process.env.CONNECTION_STRING;
        const mongooseReturn = await mongoose.connect(connectinString, { useNewUrlParser: true });
    }
}
