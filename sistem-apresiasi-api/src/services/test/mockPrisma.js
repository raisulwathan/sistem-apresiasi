// __mocks__/prisma/client/index.js

// Buat sebuah fungsi mock yang mengembalikan data yang diinginkan
const prismaMock = {
    user: {
        findMany: jest.fn().mockResolvedValue([
            { id: 1, name: "John" },
            { id: 2, name: "Doe" },
        ]),
        // Anda dapat menambahkan metode lain yang diperlukan di sini
    },
}

module.exports = {
    __esModule: true,
    default: prismaMock,
    prismaMock,
}
