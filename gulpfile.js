var gulp = require("gulp");
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");
var minify = require('gulp-minify');
var git = require('gulp-git');
var versionBump = require('gulp-bump')
var tagVersion = require('gulp-tag-version');
var webpack = require('webpack-stream');

// gulp.task("build_ES5", function() {
//     return gulp.src([
//             "src/**/*.ts",
//             "Speech.Browser.Sdk.ts"],
//             {base: '.'})
//         .pipe(tslint({
//       formatter: "prose",
//             configuration: "tslint.json"
//     }))
//     .pipe(tslint.report({
//             summarizeFailureOutput: true
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(ts({
//             target: "ES5",
//             lib: [ "ES2015", "dom" ],
//             allowJs: true,
//             removeComments: false,
//             outDir: 'distrib'
//         }))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('distrib'));
// });

//noImplicitAny: true,
// declaration: true,

gulp.task("build_ES5", function() {
    return gulp.src([
            "src/**/*.ts",
            "src/**/*.js",
            "Speech.Browser.Sdk.ts"],
            {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            lib: [ "ES2015", "dom" ],
            removeComments: false,
            allowJs: true,
            outDir: 'distrib'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('distrib'));
});

gulp.task("build", gulp.series("build_ES5"));

gulp.task("bundle", gulp.series("build_ES5", function () {
    return gulp.src('samples/browser/sample_app.js')
    .pipe(webpack({
        output: {filename: 'deepspeech.sdk.bundle.js'}, 
        devtool: 'source-map',
        module:  {
            rules: [{
                   test: /\.js$/,
                   use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread"
                      ]
                    }
                  }
            }]
        }
    }))
    .pipe(gulp.dest('distrib'));
}));

// We don't want to release anything without a successful build. So build task is dependency for these tasks.
gulp.task('patchRelease', gulp.series('build', function() { return BumpVersionTagAndCommit('patch'); }))
gulp.task('featureRelease', gulp.series('build', function() { return BumpVersionTagAndCommit('minor'); }))
gulp.task('majorRelease', gulp.series('build', function() { return BumpVersionTagAndCommit('major'); }))
gulp.task('preRelease', gulp.series('build', function() { return BumpVersionTagAndCommit('prerelease'); }))

function BumpVersionTagAndCommit(versionType) {
  return gulp.src(['./package.json'])
        // bump the version number
        .pipe(versionBump({type:versionType}))
        // save it back to filesystem 
        .pipe(gulp.dest('./'))
        // commit the changed version number 
        .pipe(git.commit('Bumping package version'))
        // tag it in the repository
    .pipe(tagVersion());
}
 
