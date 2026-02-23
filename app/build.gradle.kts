plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.services)
}

android {
    namespace = "com.example.credilabmobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.credilabmobile"
        minSdk = 29
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
    packaging {
        resources {
            excludes += "META-INF/**"
        }
    }
}

// Force androidx.lifecycle to a single version to resolve conflict between Firebase BOM and Reown BOM
configurations.all {
    resolutionStrategy {
        force("androidx.lifecycle:lifecycle-process:2.9.2")
        force("androidx.lifecycle:lifecycle-runtime:2.9.2")
        force("androidx.lifecycle:lifecycle-runtime-ktx:2.9.2")
        force("androidx.lifecycle:lifecycle-common:2.9.2")
        force("androidx.lifecycle:lifecycle-livedata-core:2.9.2")
        force("androidx.lifecycle:lifecycle-viewmodel:2.9.2")
        force("androidx.lifecycle:lifecycle-viewmodel-savedstate:2.9.2")
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.constraintlayout)
    implementation(libs.web3j)
    implementation(libs.zxing)
    implementation(libs.gson)
    implementation(libs.zxing.android.embedded)
    implementation(platform(libs.reown.bom))
    implementation(libs.reown.core)
    implementation(libs.reown.appkit)
    implementation(libs.timber)
    implementation(libs.core.ktx)

    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.play.services.auth)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)

    // AI & Chat
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    annotationProcessor(libs.room.compiler) // Using annotationProcessor since ksp/kapt not set up yet
    implementation(libs.onnxruntime)
    implementation(libs.onnxruntime.extensions)
    implementation(libs.markwon)
}