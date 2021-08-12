import { apolloServer, app } from './graphqlServer';
import config from './config/environment';

type ServerConfig = {
  host: string;
  port: number;
};

const { host, port }: ServerConfig = config.server;

app.listen({ port, host }, () =>
  console.log(
    `🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`
  )
);
