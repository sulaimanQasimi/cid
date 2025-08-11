<?php

namespace App\Providers;

use App\Models\Criminal;
use App\Models\Department;
use App\Models\District;
use App\Models\Incident;
use App\Models\IncidentCategory;
use App\Models\IncidentReport;
use App\Models\Info;
use App\Models\InfoCategory;
use App\Models\InfoType;
use App\Models\Language;
use App\Models\Meeting;
use App\Models\MeetingMessage;
use App\Models\MeetingSession;
use App\Models\Province;
use App\Models\Report;
use App\Models\ReportStat;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use App\Models\Translation;
use App\Models\User;
use App\Policies\CriminalPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\DistrictPolicy;
use App\Policies\IncidentCategoryPolicy;
use App\Policies\IncidentPolicy;
use App\Policies\IncidentReportPolicy;
use App\Policies\InfoCategoryPolicy;
use App\Policies\InfoPolicy;
use App\Policies\InfoTypePolicy;
use App\Policies\LanguagePolicy;
use App\Policies\MeetingMessagePolicy;
use App\Policies\MeetingPolicy;
use App\Policies\MeetingSessionPolicy;
use App\Policies\ProvincePolicy;
use App\Policies\ReportPolicy;
use App\Policies\ReportStatPolicy;
use App\Policies\StatCategoryItemPolicy;
use App\Policies\StatCategoryPolicy;
use App\Policies\TranslationPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Criminal::class => CriminalPolicy::class,
        Department::class => DepartmentPolicy::class,
        District::class => DistrictPolicy::class,
        Incident::class => IncidentPolicy::class,
        IncidentCategory::class => IncidentCategoryPolicy::class,
        IncidentReport::class => IncidentReportPolicy::class,
        Info::class => InfoPolicy::class,
        InfoCategory::class => InfoCategoryPolicy::class,
        InfoType::class => InfoTypePolicy::class,
        Language::class => LanguagePolicy::class,

        Province::class => ProvincePolicy::class,
        Report::class => ReportPolicy::class,
        ReportStat::class => ReportStatPolicy::class,
        StatCategory::class => StatCategoryPolicy::class,
        StatCategoryItem::class => StatCategoryItemPolicy::class,
        Translation::class => TranslationPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
