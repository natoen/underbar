module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: [
        'src/*.js',
      ],
      options: {
        force: 'true',
        eslintrc: '.eslintrc.js',
        ignores: [],
      },
    },

    mocha: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['spec/*.js'],
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      dist: {
        files: {
          'src/transpiledUnderbar.js': 'src/underbar.js',
        },
      },
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/chai.js', 'lib/mocha.js', 'lib/sinon.js', 'lib/sinon-chai.js',
              'lib/cardboard.js', 'lib/testSupport.js', 'src/transpiledUnderbar.js'],
        dest: 'src/concat.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
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
        command: 'rm src/concat.js ./src/transpiledUnderbar.js',
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
          'eslint',
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['eslint', 'babel', 'mocha', 'concat', 'uglify', 'cssmin', 'shell:removeFiles']);
};
