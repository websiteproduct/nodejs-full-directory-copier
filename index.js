import fs from 'node:fs/promises';

const copyDirectory = async (sourceDir, targetDir, finish) => {
  try {
    await fs.access(sourceDir);

    fs.readdir(sourceDir)
      .then(async content => {
        try {
          await fs.mkdir(targetDir, { recursive: true });
        } catch (error) {
          console.error(
            'Во время создания папки возникла ошибка',
            error.message,
          );
        }

        content.forEach(async item => {
          const isFile = (await fs.stat(`${sourceDir}/${item}`)).isFile();

          if (isFile) {
            fs.copyFile(`${sourceDir}/${item}`, `${targetDir}/${item}`).catch(
              err => {
                console.error('Произошла ошибка копирования', err.message);
              },
            );
          } else {
            await fs.mkdir(`${targetDir}/${item}`, { recursive: true });

            copyDirectory(`${sourceDir}/${item}`, `${targetDir}/${item}`);
          }
        });
      })
      .catch(err => {
        console.error(err.message);
      });

    if (finish) {
      finish(null);
    }
  } catch (error) {
    if (finish) {
      finish(error.message);
    }
  }
};

console.log('Start app');

copyDirectory('./sourceFolder', './targetFolder', err => {
  if (err) {
    console.log('Во время копирования папки произошла ошибка', err);
  } else {
    console.log('Папка была успешно скопирована');
  }
});
