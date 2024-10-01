"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const schema_1 = require("./schema");
async function seed() {
    await index_1.db.delete(schema_1.asks);
    await index_1.db.delete(schema_1.rooms);
    const room = await index_1.db
        .insert(schema_1.rooms)
        .values({ title: "Tow Moon In Earth" })
        .returning();
    await index_1.db.insert(schema_1.asks).values([
        {
            description: "O que é GoLang e quais são suas principais vantagens em comparação com outras linguagens de programação como Python, Java ou C++?",
            roomId: room[0].id,
            answered: true,
            reactions: 182,
        },
        {
            description: "Como funcionam as goroutines em GoLang e por que elas são importantes para a concorrência e paralelismo?",
            roomId: room[0].id,
            reactions: 173,
        },
        {
            description: "Quais são as melhores práticas para organizar o código em um projeto GoLang, incluindo pacotes, módulos e a estrutura de diretórios??",
            roomId: room[0].id,
            reactions: 87,
        },
        {
            description: "Como fazer a depuração de programas GoLang e quais ferramentas são recomendadas para isso?",
            roomId: room[0].id,
            reactions: 42,
        },
        {
            description: "Quais são os primeiros passos para começar a programar em GoLang, incluindo a instalação do ambiente de desenvolvimento, configuração e execução do primeiro programa?",
            roomId: room[0].id,
            reactions: 13,
        },
        {
            description: "Como funciona o gerenciamento de memória em GoLang, incluindo a coleta de lixo (garbage collection)? Quais são as implicações de desempenho e como otimizar o uso de memória em programas Go? Quais são as diferenças entre alocação na stack e no heap, e como essas diferenças afetam a eficiência do programa?",
            roomId: room[0].id,
            reactions: 4,
        },
    ]);
}
seed().finally(() => {
    index_1.queryClient.end();
});
