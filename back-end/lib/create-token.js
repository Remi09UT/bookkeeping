const express = require('express');
const jwt = require('jsonwebtoken');

const signature = process.env.SIGNATURE;
const expiresIn = process.env.EXPIRES_IN;

let createToken = (user) =>
    jwt.sign(
        user,
        signature,
        { expiresIn: expiresIn }
    );

module.exports = createToken;
