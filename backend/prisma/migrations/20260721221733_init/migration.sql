-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "properties" (
    "property_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "soil_type" TEXT,
    "soil_texture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("property_id")
);

-- CreateTable
CREATE TABLE "climate_data" (
    "climate_data_id" UUID NOT NULL,
    "municipality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "reference_month" INTEGER NOT NULL,
    "reference_year" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "temperature_min_annual" DOUBLE PRECISION,
    "temperature_max_annual" DOUBLE PRECISION,
    "temperature_avg_annual" DOUBLE PRECISION,
    "rainfall_annual_mm" DOUBLE PRECISION,
    "rainfall_monthly" JSONB NOT NULL,
    "humidity_avg" DOUBLE PRECISION,
    "et0_annual" DOUBLE PRECISION,
    "humidity_monthly" JSONB NOT NULL,
    "wind_speed_avg" DOUBLE PRECISION,
    "solar_radiation_avg" DOUBLE PRECISION,
    "koppen_climate_classification" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "last_fetched_at" TIMESTAMP(3) NOT NULL,
    "data_year_range" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "climate_data_pkey" PRIMARY KEY ("climate_data_id")
);

-- CreateTable
CREATE TABLE "crops" (
    "crop_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "crop_type" TEXT NOT NULL,
    "planting_date" DATE NOT NULL,
    "area_planted_hectares" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crops_pkey" PRIMARY KEY ("crop_id")
);

-- CreateTable
CREATE TABLE "irrigation_systems" (
    "irrigation_system_id" UUID NOT NULL,
    "crop_id" UUID NOT NULL,
    "system_type" TEXT NOT NULL,
    "wetting_fraction" DOUBLE PRECISION NOT NULL,
    "application_efficiency" DOUBLE PRECISION NOT NULL,
    "uniformity_coefficient" DOUBLE PRECISION,
    "spacing_between_rows_m" DOUBLE PRECISION,
    "flow_rate_liters_per_hour" DOUBLE PRECISION,
    "number_of_emitters" INTEGER,
    "irrigation_depth_mm" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "irrigation_systems_pkey" PRIMARY KEY ("irrigation_system_id")
);

-- CreateTable
CREATE TABLE "irrigation_calculations" (
    "calculation_id" UUID NOT NULL,
    "crop_id" UUID NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "climate_snapshot" JSONB NOT NULL,
    "crop_data_snapshot" JSONB NOT NULL,
    "irrigation_system_snapshot" JSONB NOT NULL,
    "eto_mm" DOUBLE PRECISION NOT NULL,
    "kc" DOUBLE PRECISION NOT NULL,
    "etcrop_mm" DOUBLE PRECISION NOT NULL,
    "rainfall_expected_mm" DOUBLE PRECISION NOT NULL,
    "soil_water_deficit_mm" DOUBLE PRECISION NOT NULL,
    "lamina_liquida_mm" DOUBLE PRECISION NOT NULL,
    "lamina_bruta_mm" DOUBLE PRECISION NOT NULL,
    "irrigation_interval_days" INTEGER NOT NULL,
    "tempo_irrigacao_hours" DOUBLE PRECISION NOT NULL,
    "volume_total_liters" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "irrigation_calculations_pkey" PRIMARY KEY ("calculation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_user_id_name_key" ON "properties"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "climate_data_municipality_state_reference_month_reference_y_key" ON "climate_data"("municipality", "state", "reference_month", "reference_year");

-- CreateIndex
CREATE UNIQUE INDEX "irrigation_systems_crop_id_key" ON "irrigation_systems"("crop_id");

-- CreateIndex
CREATE INDEX "irrigation_calculations_crop_id_calculated_at_idx" ON "irrigation_calculations"("crop_id", "calculated_at" DESC);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crops" ADD CONSTRAINT "crops_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("property_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irrigation_systems" ADD CONSTRAINT "irrigation_systems_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "crops"("crop_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irrigation_calculations" ADD CONSTRAINT "irrigation_calculations_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "crops"("crop_id") ON DELETE CASCADE ON UPDATE CASCADE;
