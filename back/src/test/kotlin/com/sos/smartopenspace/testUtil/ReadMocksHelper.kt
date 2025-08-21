package com.sos.smartopenspace.testUtil

import java.io.File

object ReadMocksHelper {
  private const val MOCKS_DIR = "src/test/resources/mocks/"

  // Auth mocks
  private const val AUTH_MOCKS_DIR = "auth/"
  private const val JWT_TOKENS_DIR = "${AUTH_MOCKS_DIR}jwt_tokens/"

  fun readJwtTokenMocksFile(filename: String): String =
    readMockFile("$JWT_TOKENS_DIR$filename")

  fun readAuthMocksFile(filename: String): String =
    readMockFile("$AUTH_MOCKS_DIR$filename")

  private fun readMockFile(filename: String): String =
    File("$MOCKS_DIR$filename").readText(Charsets.UTF_8)
}
