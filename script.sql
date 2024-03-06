CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    limite INT NOT NULL,
    saldo INT NOT NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    valor INT NOT NULL,
    tipo CHAR(1) NOT NULL,
    descricao VARCHAR(10) NOT NULL,
    realizada_em TIMESTAMP NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

INSERT INTO clients (id, limite, saldo) VALUES
(1, 100000, 0),
(2, 80000, 0),
(3, 1000000, 0),
(4, 10000000, 0),
(5, 500000, 0);
