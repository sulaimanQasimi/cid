<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('criminals', function (Blueprint $table) {
            $table->id();
            $table->string('photo')->nullable(); // عکس مجرم
            $table->string('number')->nullable(); // شماره
            $table->string('name'); // اسم
            $table->string('father_name')->nullable(); // ولد
            $table->string('grandfather_name')->nullable(); // ولدیت
            $table->string('id_card_number')->nullable(); // شماره تذکره
            $table->string('phone_number')->nullable(); // شماره تليفون
            $table->text('original_residence')->nullable(); // سکونت اصلی
            $table->text('current_residence')->nullable(); // سکونت فعلی
            $table->string('crime_type')->nullable(); // نوعیت جرم
            $table->string('arrest_location')->nullable(); // محل دستګیری
            $table->string('arrested_by')->nullable(); // دستګیری بتوسط
            $table->date('arrest_date')->nullable(); // تاریخ دستګیری
            $table->string('referred_to')->nullable(); // معرفی شده به
            $table->text('final_verdict')->nullable(); // فیصله آخری
            $table->text('notes')->nullable(); // ملاحظات
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criminals');
    }
};
