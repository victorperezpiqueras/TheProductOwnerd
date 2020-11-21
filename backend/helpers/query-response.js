class QueryResponse {
  constructor(fieldCount, affectedRows, insertId, info, serverStatus, warningStatus) {
    this.fieldCount = fieldCount;
    this.affectedRows = affectedRows;
    this.insertId = insertId;
    this.info = info;
    this.serverStatus = serverStatus;
    this.warningStatus = warningStatus;
  }
}

module.exports = QueryResponse;
