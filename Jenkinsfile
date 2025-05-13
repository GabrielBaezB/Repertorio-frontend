pipeline {
    agent any

    tools {
        nodejs 'node-18.20.7'
    }

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        NG_CLI_ANALYTICS = 'false'
        SONAR_SCANNER_HOME = tool 'repertorioQubeScanner'
        SONAR_PROJECT_KEY = 'repertorio-qube-key'
        SONAR_PROJECT_NAME = 'repertorio'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx ng lint || true'
            }
        }
        stage('Static Code Analysis with SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
                        -Dsonar.projectVersion=${env.BUILD_NUMBER} \
                        -Dsonar.sources=src \
                        -Dsonar.verbose=true \
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --json || true'
                // Opcional: dependencyCheck additionalArguments: '--scan node_modules', odcInstallation: 'OWASP-DC'
            }
        }

        stage('Build for Development') {
            when {
                branch 'develop'
            }
            steps {
                sh 'npx ng build --configuration=development'
                // Para debug: mostrar dónde están los archivos compilados
                sh 'find . -type d -name "dist" -o -name "browser" | sort'
            }
        }

        stage('Build for Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
                }
            }
            steps {
                sh 'npx ng build --configuration=production'
                // Para debug: mostrar dónde están los archivos compilados
                sh 'find . -type d -name "dist" -o -name "browser" | sort'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Usar patrón más genérico para encontrar los archivos compilados
                archiveArtifacts artifacts: '**/*.js, **/*.css, **/*.html, **/*.ico, **/*.png, **/*.svg',
                                 excludes: 'node_modules/**, .git/**',
                                 fingerprint: true
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to Development environment...'
                // Comandos de despliegue a ambiente de desarrollo
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
                }
            }
            steps {
                echo 'Deploying to Production environment...'
                // Comandos de despliegue a producción
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
