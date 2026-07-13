const SHEET_NAME = "Ответы гостей";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    // Простая защита от ботов: скрытое поле должно оставаться пустым.
    if (data.website) {
      return createResponse({ success: true });
    }

    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.attendance || "",
      data.guests || "",
      data.message || "",
      data.guestFromLink || "",
      data.submittedAt || ""
    ]);

    return createResponse({ success: true });
  } catch (error) {
    return createResponse({
      success: false,
      error: error.message
    });
  }
}

function doGet() {
  return createResponse({
    success: true,
    message: "Wedding RSVP endpoint is active."
  });
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);

    sheet.appendRow([
      "Дата получения",
      "Имя и фамилия",
      "Присутствие",
      "Количество гостей",
      "Комментарий",
      "Имя из персональной ссылки",
      "Дата отправки с сайта"
    ]);

    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    sheet.autoResizeColumns(1, 7);
  }

  return sheet;
}

function createResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
