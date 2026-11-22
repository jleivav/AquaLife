const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { chromium } = require(resolve(process.env.AQUALIFE_PLAYWRIGHT || '.venv/browser/node_modules/playwright-core'))

const base = process.env.AQUALIFE_URL || 'http://127.0.0.1:5173/'
const creds = JSON.parse(readFileSync('.aqualife-demo.local', 'utf8'))
const primary = process.env.AQUALIFE_CATEGORY
const empty = process.env.AQUALIFE_EMPTY_CATEGORY
const mutation = (page, path, method, status, action) => Promise.all([
  page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1' + path
    && response.request().method() === method && response.status() === status),
  action(),
]).then(([response]) => response)

async function login(page, username) {
  await page.goto(base + '#comunidad')
  await page.getByLabel('Usuario', { exact: true }).fill(username)
  await page.getByLabel('Contraseña').fill(creds[username])
  await mutation(page, '/auth/login', 'POST', 200, () => page.getByRole('button', { name: 'Iniciar sesión' }).click())
  await page.getByRole('button', { name: 'Cerrar sesión' }).waitFor()
}

async function registerTank(page, name, category, liters) {
  const form = page.getByRole('form', { name: 'Registrar pecera' })
  await form.getByLabel('Nombre de la pecera').fill(name)
  if (category) await form.getByLabel('Categoría de la pecera').selectOption({ label: category })
  if (liters) await form.getByLabel('Litros').fill(liters)
  await mutation(page, '/peceras', 'POST', 201, () => form.getByRole('button', { name: 'Registrar pecera' }).click())
}

async function main() {
  assert.ok(primary && empty, 'Define dos categorías de prueba nuevas en PostgreSQL.')
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    const alice = await browser.newPage()
    const bob = await browser.newPage()
    const tag = `c3-${Date.now()}`
    const postText = `Publicación ${tag}`
    await login(alice, 'joaquin_demo')
    await login(bob, 'kenneth_demo')
    const preference = alice.getByLabel('Avisos por respuestas')
    await preference.waitFor()
    const original = await preference.isChecked()
    if (!original) {
      await preference.check()
      await mutation(alice, '/preferencias-notificaciones', 'PATCH', 200,
        () => alice.getByRole('button', { name: 'Guardar preferencias' }).click())
    }

    await alice.getByLabel('Crear publicación').fill(postText)
    const post = await (await mutation(alice, '/publicaciones', 'POST', 201,
      () => alice.getByRole('button', { name: 'Publicar', exact: true }).click())).json()
    await alice.reload()
    await alice.getByText(postText, { exact: true }).waitFor()
    console.log('HU1: publicación persistente tras recarga')

    const search = async (page, term) => {
      await page.getByLabel('Buscar por tema').fill(term)
      await page.getByRole('button', { name: 'Buscar', exact: true }).click()
    }
    await search(bob, tag + '-sin-coincidencias')
    await bob.getByText('No se encontraron publicaciones relacionadas.').waitFor()
    await search(bob, tag)
    const article = bob.getByRole('article').filter({ hasText: postText })
    await article.getByRole('button', { name: 'Comentarios' }).click()
    const comment = `Respuesta ${tag}`
    assert.ok(await article.getByRole('button', { name: 'Enviar comentario' }).isDisabled())
    await article.getByRole('textbox', { name: 'Comentario' }).fill(comment)
    await mutation(bob, `/publicaciones/${post.id}/comentarios`, 'POST', 201,
      () => article.getByRole('button', { name: 'Enviar comentario' }).click())
    await article.getByText(comment, { exact: false }).waitFor()
    const replyNotice = alice.locator('#notificaciones').getByText('Nueva respuesta en su publicación.', { exact: false })
    const count = await replyNotice.count()
    await alice.getByRole('button', { name: 'Actualizar avisos' }).click()
    await alice.waitForFunction(expected =>
      document.querySelectorAll('#notificaciones li').length >= expected, count + 1)
    await replyNotice.first().waitFor()
    console.log('HU2, HU3, HU10: respuesta persistida, búsqueda y aviso')

    const fish = alice.locator('#peces')
    await fish.getByLabel('Buscar especie').fill(tag)
    await fish.getByRole('button', { name: 'Consultar especies' }).click()
    await fish.getByText('No se encontró información sobre esa especie.').waitFor()
    await fish.getByLabel('Buscar especie').fill('demostración')
    await fish.getByRole('button', { name: 'Consultar especies' }).click()
    await fish.getByRole('button', { name: 'Especie de demostración', exact: true }).click()
    await fish.getByRole('region', { name: 'Ficha de especie' }).getByText('Cuidados:', { exact: true }).waitFor()
    await fish.getByLabel('Nombre del pez').fill(`Pez ${tag}`)
    await fish.getByRole('combobox').selectOption({ label: 'Especie de demostración' })
    const record = await (await mutation(alice, '/peces', 'POST', 201,
      () => fish.getByRole('button', { name: 'Registrar pez' }).click())).json()
    await fish.getByRole('button', { name: `Editar Pez ${tag}` }).click()
    await fish.getByLabel('Nombre del pez').fill(`Editado ${tag}`)
    await mutation(alice, `/peces/${record.id}`, 'PATCH', 200,
      () => fish.getByRole('button', { name: 'Guardar cambios' }).click())
    await alice.reload()
    await fish.getByRole('button', { name: `Editar Editado ${tag}` }).waitFor()
    assert.equal(await bob.locator('#peces').getByText(`Editado ${tag}`).count(), 0)
    console.log('HU4, HU5, HU6: ficha, registro, edición y aislamiento')

    const rankA = alice.locator('#ranking')
    const rankB = bob.locator('#ranking')
    await rankA.getByLabel('Categoría del ranking').selectOption({ label: empty })
    await rankA.getByText('Actualmente no existen participantes en esta categoría.').waitFor()
    await registerTank(alice, `Incompleta ${tag}`)
    await rankA.getByRole('button', { name: 'Inscribir pecera' }).click()
    await rankA.getByRole('alert').getByText('Completa los litros', { exact: false }).waitFor()
    const tankA = `Pecera A ${tag}`
    const tankB = `Pecera B ${tag}`
    await registerTank(alice, tankA, primary, '80')
    await mutation(alice, '/inscripciones', 'POST', 201, () => rankA.getByRole('button', { name: 'Inscribir pecera' }).click())
    await registerTank(bob, tankB, primary, '90')
    await mutation(bob, '/inscripciones', 'POST', 201, () => rankB.getByRole('button', { name: 'Inscribir pecera' }).click())
    await rankB.getByRole('button', { name: `Votar por ${tankB}` }).waitFor()
    await rankB.getByRole('button', { name: `Votar por ${tankB}` }).click()
    await rankB.getByRole('alert').getByText('propia pecera', { exact: false }).waitFor()
    await rankB.getByRole('button', { name: `Votar por ${tankA}` }).click()
    await rankB.getByText('Voto registrado.').waitFor()
    await rankB.getByRole('button', { name: `Votar por ${tankA}` }).click()
    await rankB.getByRole('alert').getByText('Ya votó', { exact: false }).waitFor()
    await bob.getByRole('button', { name: 'Actualizar avisos' }).click()
    await bob.locator('#notificaciones').getByText('Su pecera ahora ocupa la posición 2.', { exact: false }).first().waitFor()
    console.log('HU7, HU8, HU9, HU11: inscripción, ranking, rechazos y cambio de posición')

    await preference.uncheck()
    await mutation(alice, '/preferencias-notificaciones', 'PATCH', 200,
      () => alice.getByRole('button', { name: 'Guardar preferencias' }).click())
    await alice.reload()
    await preference.waitFor()
    assert.equal(await preference.isChecked(), false)
    await replyNotice.first().waitFor()
    const beforeMute = await replyNotice.count()
    await article.getByRole('textbox', { name: 'Comentario' }).fill(`Aviso desactivado ${tag}`)
    await mutation(bob, `/publicaciones/${post.id}/comentarios`, 'POST', 201,
      () => article.getByRole('button', { name: 'Enviar comentario' }).click())
    await mutation(alice, '/notificaciones', 'GET', 200,
      () => alice.getByRole('button', { name: 'Actualizar avisos' }).click())
    await alice.getByText('Cargando avisos…', { exact: true }).waitFor({ state: 'hidden' })
    assert.equal(await replyNotice.count(), beforeMute)
    await preference.setChecked(original)
    await mutation(alice, '/preferencias-notificaciones', 'PATCH', 200,
      () => alice.getByRole('button', { name: 'Guardar preferencias' }).click())
    console.log('HU12: persistencia y supresión del aviso desactivado')

    await alice.setViewportSize({ width: 390, height: 844 })
    await alice.goto(base + '#simulacion')
    await alice.getByLabel('Duración').selectOption('1')
    await alice.getByLabel('Intervalo').selectOption('6')
    await alice.getByRole('button', { name: 'Aplicar escenario' }).click()
    await alice.getByText('Hora 0 de 24 · muestras cada 6 h · 5 muestras', { exact: true }).waitFor()
    await alice.getByLabel('Hora del escenario').focus()
    await alice.keyboard.press('End')
    await alice.getByText('Hora 24 de 24 · muestras cada 6 h · 5 muestras', { exact: true }).waitFor()
    console.log('Simulación: duración, intervalo y selección de hora en móvil')
  } finally { await browser.close() }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
