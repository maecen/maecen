#!/bin/bash
set -e

mv /root/pg_hba.conf /var/lib/postgresql/data

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    create database maecen;
EOSQL