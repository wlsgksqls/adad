export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  }
  return response.json();
}

export async function loadSiteData(prefix = ".") {
  const site = await loadJSON(`${prefix}/data/site.json`);
  const subjects = await Promise.all(
    site.subjectFiles.map((file) => loadJSON(`${prefix}/data/subjects/${file}`))
  );

  return { site, subjects };
}

export function flattenUnits(subjects) {
  return subjects.flatMap((subject) =>
    subject.levels.flatMap((level) =>
      level.groups.flatMap((group) =>
        group.units.map((unit) => ({
          ...unit,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectIcon: subject.icon,
          subjectColor: subject.colors,
          levelId: level.id,
          levelName: level.name,
          groupId: group.id,
          groupName: group.name
        }))
      )
    )
  );
}
