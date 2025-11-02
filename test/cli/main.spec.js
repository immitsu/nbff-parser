import assert from 'assert'
import test from 'node:test'

import * as cli from '../../cli/main.js'

test.describe('main function call', () => {
  test('throws error on unknown command', async () => {
    const args = ['unknown', 'files=a.html,b.html', 'output=out.html']
    await assert.rejects(() => cli.main(args), /❌ Unknown command/)
  })

  test('help command', () => {
    const match = async cmd => {
      const message = await cli.main([cmd])
      assert.match(message, /nbff-parser – a simple parser/)
    }

    return Promise.all(['--help', '-h'].map(match))
  })

  test('version command', () => {
    const match = async cmd => {
      const message = await cli.main([cmd])
      assert.match(message, /^v\d+\.\d+\.\d+$/)
    }

    return Promise.all(['--version', '-v'].map(match))
  })

  test.describe('exclude command', () => {
    test('logs result', async () => {
      const exclude = async (file, attrs, output) =>
        `excluded ${attrs} from ${file} and saved a new file ${output}`

      const message = await cli.main(
        ['exclude', 'file=a.html', 'attrs=add_date,icon', 'output=out.html'],
        { exclude }
      )

      assert.equal(
        message,
        '✅ excluded add_date,icon from a.html and saved a new file out.html'
      )
    })

    test('throws if file or attributes are missing', async () => {
      const exclude = async () => {
        throw new Error('should not be called')
      }

      await assert.rejects(
        () => cli.main(['exclude', 'file=a.html'], { exclude }),
        /❌ Usage: nbff-parser exclude/
      )

      await assert.rejects(
        () => cli.main(['exclude', 'attrs=add_date'], { exclude }),
        /❌ Usage: nbff-parser exclude/
      )
    })
  })

  test.describe('merge command', () => {
    test('logs result', async () => {
      const merge = async (files, output) => `merged ${files} into ${output}`

      const message = await cli.main(
        ['merge', 'files=a.html,b.html', 'output=out.html'],
        { merge }
      )

      assert.equal(message, '✅ merged a.html,b.html into out.html')
    })

    test('throws if files or output are missing', async () => {
      const merge = async () => {
        throw new Error('should not be called')
      }

      await assert.rejects(
        () => cli.main(['merge', 'files=a.html,b.html'], { merge }),
        /❌ Usage: nbff-parser merge/
      )

      await assert.rejects(
        () => cli.main(['merge', 'output=out.html'], { merge }),
        /❌ Usage: nbff-parser merge/
      )
    })
  })
})
