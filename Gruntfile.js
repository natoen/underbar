module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: [
        'src/underbar.js',
      ],
      options: {
        force: 'true',
        eslintrc: '.eslintrc.js',
        ignores: [],
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      dist: {
        files: {
          'dist/transpiledUnderbar.js': 'src/underbar.js',
        },
      },
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/chai.js', 'lib/mocha.js', 'lib/sinon.js', 'lib/sinon-chai.js',
              'lib/cardboard.js', 'lib/testSupport.js'],
        dest: 'src/concatLib.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'dist/lib.min.js': ['<%= concat.dist.dest %>'],
        },
      },
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
      },
      target: {
        files: [{
          expand: true,
          cwd: 'lib/css',
          src: ['mocha.css'],
          dest: 'dist',
          ext: '.min.css',
        }],
      },
    },

    shell: {
      removeFiles: {
        command: 'rm src/concatLib.js dist/transpiledUnderbar.js.map',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true,
        },
      },
    },

    watch: {
      scripts: {
        files: [
          'src/underbar.js',
        ],
        tasks: [
          'build',
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['eslint', 'babel', 'concat', 'uglify', 'cssmin', 'shell:removeFiles']);
};
