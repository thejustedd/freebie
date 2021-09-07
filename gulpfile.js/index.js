const { src, dest, series, parallel, watch, lastRun } = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  webphtml = require('gulp-webp-html'),
  webpcss = require('gulp-webpcss'),
  svgSpr = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter'),
  fs = require('fs');

// const project_folder = require('path').basename(__dirname);
const project_folder = 'dist';
const source_folder = 'src';

const path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/'
};

function browserSync(cb) {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    // tunnel: 'freebie',
    // open: false,
    // open: 'tunnel',
  });
  cb();
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
    .pipe(webpcss())
    .pipe(group_media())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(webp({ quality: 70 }))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 3 // 0 to 7
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function svgSprite() {
  return src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgSpr({
      mode: {
        stack: {
          sprite: '../icons/icons.svg', //sprite file name
          // example: true
        }
      }
    }))
    .pipe(dest(path.build.img));
}

function fonts() {
  return src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function otf2ttf() {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
}

function fontsStyle(cb) {
  let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
  cb();
}

function watchFiles(cb) {
  watch([path.watch.html], { ignoreInitial: false }, html);
  watch([path.watch.css], { ignoreInitial: false }, css);
  watch([path.watch.js], { ignoreInitial: false }, js);
  // watch([path.watch.html], { ignoreInitial: false }, html);
  // watch([path.watch.css], { ignoreInitial: false }, css);
  // watch([path.watch.js], { ignoreInitial: false }, js);
  watch([path.watch.img], images);
  cb();
}

function clean() {
  return del(path.clean);
}

// const build = series(clean, parallel(html, css, js, images, fonts), fontsStyle);
// const watching = parallel(build, watchFiles, browserSync);
const build = series(clean, parallel(html, css, js, images, fonts));
const watching = parallel(html, css, js, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.otf2ttf = otf2ttf;
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watching = watching;
exports.default = watching;