var assert = require('assert');
var value = '';

Feature('string');

Scenario('should have correct initial value', async (I) => {
  I.amOnPage('string-ace-editor.html');
  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, '[]');
});

Scenario('should have coerent values', async (I) => {
  I.amOnPage('string-ace-editor.html');
  I.click('Add item');
  I.see('item 1');
  I.seeElement('.ace_editor');

  I.click('.ace_editor');
  I.pressKey('__YELLOW__');
  I.see('__YELLOW__');

  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, JSON.stringify([{"editor":"__YELLOW__"}]));
});

Scenario('should have correct initial value', async (I) => {
  I.amOnPage('string-sceditor.html');
  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, '[]');
});

Scenario('editor value and String editor should have coerent values', async (I) => {
  I.amOnPage('string-sceditor.html');
  I.click('Add item');
  I.see('item 1');

  // enters first iframe, writes text on the body and then exits
  I.switchTo('[data-schemapath="root.0.editor"] iframe');
  I.click('body');
  I.pressKey('__YELLOW__');
  I.see('__YELLOW__');
  I.switchTo();

  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, JSON.stringify([{"editor":"<p>__YELLOW__<br></p>"}]));
});

Scenario('Should work correctly in arrays @optional', async (I) => {
  I.amOnPage('string-sceditor.html');
  I.click('Add item');
  I.click('Add item');
  I.see('item 1');
  I.see('item 2');

  // enters first iframe, writes text on the body and then exits
  I.switchTo('[data-schemapath="root.0.editor"] iframe');
  I.click('body');
  I.pressKey('__YELLOW__');
  I.see('__YELLOW__');
  I.switchTo();

  // enters first iframe and read text
  I.switchTo('[data-schemapath="root.0.editor"] iframe');
  I.see('__YELLOW__');
  I.switchTo();

  // enters secod iframe, writes text on the body and then exits
  I.switchTo('[data-schemapath="root.1.editor"] iframe');
  I.click('body');
  I.pressKey('__BLUE__');
  I.see('__BLUE__');
  I.switchTo();

  // enters second iframe and read text
  I.switchTo('[data-schemapath="root.1.editor"] iframe');
  I.see('__BLUE__');
  I.switchTo();

  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, JSON.stringify([{"editor":"<p>__YELLOW__<br></p>"},{"editor":"<p>__BLUE__<br></p>"}]));

  I.click('.json-editor-btn-movedown');
  I.click('.get-value');
  value = await I.grabValueFrom('.debug');
  assert.equal(value, JSON.stringify([{"editor":"<p>__BLUE__<br></p>"},{"editor":"<p>__YELLOW__<br></p>"}]));

  // the last 2 tests will fail because Sceditors iframes loose their content when the iframe is reloaded.

  // enters first iframe and read text
  I.switchTo('[data-schemapath="root.0.editor"] iframe');
  I.see('__BLUE__');
  I.switchTo();

  // enters second iframe and read text
  I.switchTo('[data-schemapath="root.1.editor"] iframe');
  I.see('__YELLOW__');
  I.switchTo();

});