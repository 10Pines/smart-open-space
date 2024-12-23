package com.sos.smartopenspace.testUtil

import java.io.File

object ReadMocksHelper {
    private const val MOCKS_DIR = "src/test/resources/mocks/"

    // Auth mocks
    private const val AUTH_MOCKS_DIR = "auth/"
    private const val JWT_TOKENS_DIR = "${AUTH_MOCKS_DIR}jwt_tokens/"

    fun readMockFile(textFileName: String): String =
        File("$MOCKS_DIR$textFileName").readText(Charsets.UTF_8)

    fun readMockJwtTokensFile(textFileName: String): String =
        readMockFile("$JWT_TOKENS_DIR$textFileName")
}
