require('synced-model')(1, {}, require('socketstream').send(1)); require('echo-responder')(2, {}, require('socketstream').send(2)); require('events-responder')(0, {}, require('socketstream').send(0)); require('socketstream-rpc')(3, {}, require('socketstream').send(3)); require('socketstream').assignTransport({});